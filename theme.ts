export const colors = {
  background: '#1C2732',
  surface: '#2A3441',
  primary: '#DAFF3E',
  text: {
    primary: '#FFFFFF',
    secondary: '#9BA5B7',
  },
  border: '#3A4553',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.text.primary,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    color: colors.text.primary,
  },
  caption: {
    fontSize: 14,
    color: colors.text.secondary,
  },
}; 