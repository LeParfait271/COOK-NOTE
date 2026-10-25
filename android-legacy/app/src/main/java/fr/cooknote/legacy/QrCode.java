package fr.cooknote.legacy;

import java.nio.charset.Charset;

/**
 * Encodeur QR code minimal (mode octet, correction M, versions 1 a 40), sans
 * dependance, pour afficher la liste de courses a scanner depuis un telephone.
 * Suit la norme ISO/IEC 18004 ; verifie module par module contre la librairie
 * QR du site (scripts de validation Android).
 */
final class QrCode {
    private static final int[] ECC_CODEWORDS_PER_BLOCK = {
            -1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26,
            26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28
    };
    private static final int[] ERROR_CORRECTION_BLOCKS = {
            -1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16,
            17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49
    };
    // Bits de format du niveau M (01 -> 0 apres le codage de la norme).
    private static final int ECC_FORMAT_BITS = 0;

    final int version;
    final int size;
    final int mask;
    private final boolean[][] modules;
    private final boolean[][] isFunction;

    private QrCode(int version, int forcedMask, byte[] dataCodewords) {
        this.version = version;
        size = version * 4 + 17;
        modules = new boolean[size][size];
        isFunction = new boolean[size][size];
        drawFunctionPatterns();
        drawCodewords(addEccAndInterleave(dataCodewords));
        int chosen = forcedMask;
        if (chosen < 0) {
            int minPenalty = Integer.MAX_VALUE;
            for (int candidate = 0; candidate < 8; candidate += 1) {
                applyMask(candidate);
                drawFormatBits(candidate);
                int penalty = penaltyScore();
                if (penalty < minPenalty) {
                    chosen = candidate;
                    minPenalty = penalty;
                }
                applyMask(candidate);
            }
        }
        mask = chosen;
        applyMask(mask);
        drawFormatBits(mask);
    }

    static QrCode encodeText(String text) {
        return encode(text.getBytes(Charset.forName("UTF-8")), -1, -1);
    }

    /** Version et masque forcables (-1 = automatique) pour les tests. */
    static QrCode encode(byte[] data, int forcedVersion, int forcedMask) {
        int version = forcedVersion;
        if (version < 0) {
            for (version = 1; ; version += 1) {
                if (version > 40) throw new IllegalArgumentException("Donnees trop longues pour un QR code");
                if (dataBitsNeeded(data.length, version) <= numDataCodewords(version) * 8) break;
            }
        } else if (dataBitsNeeded(data.length, version) > numDataCodewords(version) * 8) {
            throw new IllegalArgumentException("Version trop petite");
        }
        int capacityBits = numDataCodewords(version) * 8;
        BitBuffer bits = new BitBuffer(capacityBits);
        bits.append(0x4, 4);
        bits.append(data.length, version <= 9 ? 8 : 16);
        for (byte value : data) bits.append(value & 0xFF, 8);
        bits.append(0, Math.min(4, capacityBits - bits.length));
        bits.append(0, (8 - bits.length % 8) % 8);
        for (int pad = 0xEC; bits.length < capacityBits; pad ^= 0xEC ^ 0x11) bits.append(pad, 8);
        return new QrCode(version, forcedMask, bits.toBytes());
    }

    boolean isDark(int x, int y) {
        return x >= 0 && x < size && y >= 0 && y < size && modules[y][x];
    }

    private static int dataBitsNeeded(int byteCount, int version) {
        return 4 + (version <= 9 ? 8 : 16) + byteCount * 8;
    }

    private void drawFunctionPatterns() {
        for (int index = 0; index < size; index += 1) {
            setFunctionModule(6, index, index % 2 == 0);
            setFunctionModule(index, 6, index % 2 == 0);
        }
        drawFinderPattern(3, 3);
        drawFinderPattern(size - 4, 3);
        drawFinderPattern(3, size - 4);
        int[] alignPositions = alignmentPatternPositions();
        int count = alignPositions.length;
        for (int i = 0; i < count; i += 1) {
            for (int j = 0; j < count; j += 1) {
                boolean overlapsFinder = (i == 0 && j == 0) || (i == 0 && j == count - 1) || (i == count - 1 && j == 0);
                if (!overlapsFinder) drawAlignmentPattern(alignPositions[i], alignPositions[j]);
            }
        }
        drawFormatBits(0);
        drawVersion();
    }

    private void drawFormatBits(int maskValue) {
        int data = ECC_FORMAT_BITS << 3 | maskValue;
        int rem = data;
        for (int i = 0; i < 10; i += 1) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
        int bits = (data << 10 | rem) ^ 0x5412;
        for (int i = 0; i <= 5; i += 1) setFunctionModule(8, i, bit(bits, i));
        setFunctionModule(8, 7, bit(bits, 6));
        setFunctionModule(8, 8, bit(bits, 7));
        setFunctionModule(7, 8, bit(bits, 8));
        for (int i = 9; i < 15; i += 1) setFunctionModule(14 - i, 8, bit(bits, i));
        for (int i = 0; i < 8; i += 1) setFunctionModule(size - 1 - i, 8, bit(bits, i));
        for (int i = 8; i < 15; i += 1) setFunctionModule(8, size - 15 + i, bit(bits, i));
        setFunctionModule(8, size - 8, true);
    }

    private void drawVersion() {
        if (version < 7) return;
        int rem = version;
        for (int i = 0; i < 12; i += 1) rem = (rem << 1) ^ ((rem >>> 11) * 0x1F25);
        int bits = version << 12 | rem;
        for (int i = 0; i < 18; i += 1) {
            boolean dark = bit(bits, i);
            int a = size - 11 + i % 3;
            int b = i / 3;
            setFunctionModule(a, b, dark);
            setFunctionModule(b, a, dark);
        }
    }

    private void drawFinderPattern(int x, int y) {
        for (int dy = -4; dy <= 4; dy += 1) {
            for (int dx = -4; dx <= 4; dx += 1) {
                int distance = Math.max(Math.abs(dx), Math.abs(dy));
                int xx = x + dx;
                int yy = y + dy;
                if (xx >= 0 && xx < size && yy >= 0 && yy < size) setFunctionModule(xx, yy, distance != 2 && distance != 4);
            }
        }
    }

    private void drawAlignmentPattern(int x, int y) {
        for (int dy = -2; dy <= 2; dy += 1) {
            for (int dx = -2; dx <= 2; dx += 1) {
                setFunctionModule(x + dx, y + dy, Math.max(Math.abs(dx), Math.abs(dy)) != 1);
            }
        }
    }

    private void setFunctionModule(int x, int y, boolean dark) {
        modules[y][x] = dark;
        isFunction[y][x] = true;
    }

    private byte[] addEccAndInterleave(byte[] data) {
        int numBlocks = ERROR_CORRECTION_BLOCKS[version];
        int blockEccLen = ECC_CODEWORDS_PER_BLOCK[version];
        int rawCodewords = numRawDataModules(version) / 8;
        int numShortBlocks = numBlocks - rawCodewords % numBlocks;
        int shortBlockLen = rawCodewords / numBlocks;
        byte[] divisor = reedSolomonDivisor(blockEccLen);
        byte[][] blocks = new byte[numBlocks][];
        for (int i = 0, offset = 0; i < numBlocks; i += 1) {
            int dataLen = shortBlockLen - blockEccLen + (i < numShortBlocks ? 0 : 1);
            byte[] block = new byte[shortBlockLen + 1];
            System.arraycopy(data, offset, block, 0, dataLen);
            offset += dataLen;
            byte[] ecc = reedSolomonRemainder(data, offset - dataLen, dataLen, divisor);
            System.arraycopy(ecc, 0, block, block.length - blockEccLen, blockEccLen);
            blocks[i] = block;
        }
        byte[] result = new byte[rawCodewords];
        for (int i = 0, k = 0; i < shortBlockLen + 1; i += 1) {
            for (int j = 0; j < numBlocks; j += 1) {
                // Les blocs courts n ont pas d octet a la position de bourrage.
                if (i != shortBlockLen - blockEccLen || j >= numShortBlocks) {
                    result[k] = blocks[j][i];
                    k += 1;
                }
            }
        }
        return result;
    }

    private void drawCodewords(byte[] data) {
        int i = 0;
        for (int right = size - 1; right >= 1; right -= 2) {
            if (right == 6) right = 5;
            for (int vert = 0; vert < size; vert += 1) {
                for (int j = 0; j < 2; j += 1) {
                    int x = right - j;
                    boolean upward = ((right + 1) & 2) == 0;
                    int y = upward ? size - 1 - vert : vert;
                    if (!isFunction[y][x] && i < data.length * 8) {
                        modules[y][x] = bit(data[i >>> 3], 7 - (i & 7));
                        i += 1;
                    }
                }
            }
        }
    }

    private void applyMask(int maskValue) {
        for (int y = 0; y < size; y += 1) {
            for (int x = 0; x < size; x += 1) {
                if (isFunction[y][x]) continue;
                boolean invert;
                switch (maskValue) {
                    case 0: invert = (x + y) % 2 == 0; break;
                    case 1: invert = y % 2 == 0; break;
                    case 2: invert = x % 3 == 0; break;
                    case 3: invert = (x + y) % 3 == 0; break;
                    case 4: invert = (x / 3 + y / 2) % 2 == 0; break;
                    case 5: invert = x * y % 2 + x * y % 3 == 0; break;
                    case 6: invert = (x * y % 2 + x * y % 3) % 2 == 0; break;
                    default: invert = ((x + y) % 2 + x * y % 3) % 2 == 0; break;
                }
                if (invert) modules[y][x] = !modules[y][x];
            }
        }
    }

    // Regles de penalite identiques a la librairie QR du site pour choisir le
    // meme masque (N1 = 3, N2 = 3, N3 = 40, N4 = 10).
    private int penaltyScore() {
        int result = 0;
        for (int a = 0; a < size; a += 1) {
            int rowRun = 0;
            int colRun = 0;
            int rowPattern = 0;
            int colPattern = 0;
            boolean rowLast = false;
            boolean colLast = false;
            for (int b = 0; b < size; b += 1) {
                boolean rowCell = modules[a][b];
                boolean colCell = modules[b][a];
                if (b > 0 && rowCell == rowLast) {
                    rowRun += 1;
                } else {
                    if (rowRun >= 5) result += 3 + rowRun - 5;
                    rowLast = rowCell;
                    rowRun = 1;
                }
                if (b > 0 && colCell == colLast) {
                    colRun += 1;
                } else {
                    if (colRun >= 5) result += 3 + colRun - 5;
                    colLast = colCell;
                    colRun = 1;
                }
                rowPattern = ((rowPattern << 1) & 0x7FF) | (rowCell ? 1 : 0);
                colPattern = ((colPattern << 1) & 0x7FF) | (colCell ? 1 : 0);
                if (b >= 10 && (rowPattern == 0x5D0 || rowPattern == 0x05D)) result += 40;
                if (b >= 10 && (colPattern == 0x5D0 || colPattern == 0x05D)) result += 40;
            }
            if (rowRun >= 5) result += 3 + rowRun - 5;
            if (colRun >= 5) result += 3 + colRun - 5;
        }
        int dark = 0;
        for (int y = 0; y < size; y += 1) {
            for (int x = 0; x < size; x += 1) {
                if (modules[y][x]) dark += 1;
                if (y < size - 1 && x < size - 1) {
                    boolean color = modules[y][x];
                    if (color == modules[y][x + 1] && color == modules[y + 1][x] && color == modules[y + 1][x + 1]) result += 3;
                }
            }
        }
        int total = size * size;
        result += Math.abs((int) Math.ceil(100.0 * dark / total / 5) - 10) * 10;
        return result;
    }

    private int[] alignmentPatternPositions() {
        if (version == 1) return new int[0];
        int numAlign = version / 7 + 2;
        int step = version == 32 ? 26 : (version * 4 + numAlign * 2 + 1) / (numAlign * 2 - 2) * 2;
        int[] result = new int[numAlign];
        result[0] = 6;
        for (int i = result.length - 1, pos = size - 7; i >= 1; i -= 1, pos -= step) result[i] = pos;
        return result;
    }

    private static int numRawDataModules(int version) {
        int result = (16 * version + 128) * version + 64;
        if (version >= 2) {
            int numAlign = version / 7 + 2;
            result -= (25 * numAlign - 10) * numAlign - 55;
            if (version >= 7) result -= 36;
        }
        return result;
    }

    private static int numDataCodewords(int version) {
        return numRawDataModules(version) / 8 - ECC_CODEWORDS_PER_BLOCK[version] * ERROR_CORRECTION_BLOCKS[version];
    }

    private static byte[] reedSolomonDivisor(int degree) {
        byte[] result = new byte[degree];
        result[degree - 1] = 1;
        int root = 1;
        for (int i = 0; i < degree; i += 1) {
            for (int j = 0; j < result.length; j += 1) {
                result[j] = (byte) gfMultiply(result[j] & 0xFF, root);
                if (j + 1 < result.length) result[j] ^= result[j + 1];
            }
            root = gfMultiply(root, 0x02);
        }
        return result;
    }

    private static byte[] reedSolomonRemainder(byte[] data, int offset, int length, byte[] divisor) {
        byte[] result = new byte[divisor.length];
        for (int index = offset; index < offset + length; index += 1) {
            int factor = (data[index] ^ result[0]) & 0xFF;
            System.arraycopy(result, 1, result, 0, result.length - 1);
            result[result.length - 1] = 0;
            for (int i = 0; i < result.length; i += 1) result[i] ^= (byte) gfMultiply(divisor[i] & 0xFF, factor);
        }
        return result;
    }

    private static int gfMultiply(int x, int y) {
        int z = 0;
        for (int i = 7; i >= 0; i -= 1) {
            z = (z << 1) ^ ((z >>> 7) * 0x11D);
            z ^= ((y >>> i) & 1) * x;
        }
        return z;
    }

    private static boolean bit(int value, int index) {
        return ((value >>> index) & 1) != 0;
    }

    private static final class BitBuffer {
        private final byte[] bytes;
        int length;

        BitBuffer(int capacityBits) {
            bytes = new byte[(capacityBits + 7) / 8];
        }

        void append(int value, int count) {
            for (int i = count - 1; i >= 0; i -= 1) {
                if (((value >>> i) & 1) != 0) bytes[length >>> 3] |= (byte) (1 << (7 - (length & 7)));
                length += 1;
            }
        }

        byte[] toBytes() {
            return bytes;
        }
    }
}
