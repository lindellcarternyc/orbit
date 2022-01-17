import { LPosition } from '../l-position'

export enum TokenType {
  Keyword = 'KEYWORD',
  Identifier = 'IDENTIFIER',
  BuiltinType = 'BUILT IN TYPENAME',
  
  // Punctuation
  LParens = 'LEFT PARENS',
  RParens = 'RIGHT PARENS',

  LBrace = 'LEFT BRACE',
  RBrace = 'RIGHT BRACE',

  LBracket = 'LEFT BRACKET',
  RBracket = 'RIGHT BRACKET',
  Punctuation = 'PUNCTUATION',

  // Values
  Bool = 'BOOLEAN',
  Number = 'NUMBER',
  String = 'STRING',

  // Operators
  BinaryOperator = 'BINARY OPERATOR',
  AssignmentOperator = 'ASSIGNMENT OPERATOR',
  DotOperator = 'DOT OPERATOR',

  // MISC
  Whitespace = 'WHITESPACE',
  Newline = 'NEWLINE',
  Unrecognized = 'UNRECOGNIZED'
}

export interface LToken<T extends TokenType, V extends string = string> {
  type: T
  value: V
  range: {
    start: LPosition
    end: LPosition
  }
}

export type KeywordToken = LToken<TokenType.Keyword>
export type IdentifierToken = LToken<TokenType.Identifier>
export type BuiltinTypeToken = LToken<TokenType.BuiltinType>
export type UnrecognizedToken = LToken<TokenType.Unrecognized>
export type ParenToken = 
  | LToken<TokenType.LParens, '('>
  | LToken<TokenType.RParens, ')'>
export type BraceToken = 
  | LToken<TokenType.LBrace, '['>
  | LToken<TokenType.RBrace, ']'>
export type BracketToken =
  | LToken<TokenType.LBracket, '{'>
  | LToken<TokenType.RBracket, '}'>
export type PuncToken = LToken<TokenType.Punctuation>
export type BoolToken = LToken<TokenType.Bool, 'true' | 'false'>
export type NumberToken = LToken<TokenType.Number>
export type StringToken = LToken<TokenType.String>
export type OperatorToken = 
  | LToken<TokenType.BinaryOperator>
  | LToken<TokenType.AssignmentOperator, '='>
  | LToken<TokenType.DotOperator, '.'>
export type WhitespaceToken = LToken<TokenType.Whitespace>
export type NewlineToken = LToken<TokenType.Newline>

export type Token = 
  | KeywordToken
  | IdentifierToken
  | BuiltinTypeToken
  | BoolToken
  | ParenToken
  | BraceToken
  | BracketToken
  | PuncToken
  | NumberToken
  | StringToken
  | OperatorToken
  | WhitespaceToken
  | NewlineToken
  | UnrecognizedToken