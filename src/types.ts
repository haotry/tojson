/**
 * JSON 验证结果
 */
export interface ValidationResult {
  isValid: boolean;
  message: string;
  error: {
    line: number;
    column: number;
    description: string;
  } | null;
}

/**
 * JSON 格式化结果
 */
export interface FormatResult {
  success: boolean;
  output: string;
  error: string | null;
}

/**
 * JSON 压缩结果
 */
export interface CompressResult {
  success: boolean;
  output: string;
  originalSize: number;
  compressedSize: number;
  error: string | null;
}

/**
 * 字符串转义结果
 */
export interface EscapeResult {
  success: boolean;
  output: string;
  error: string | null;
}
