
export const pageContainerStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export const headerStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
};

export const titleGroupStyles = {
  display: "flex",
  flexDirection: "column",
  gap: 0.5,
};

export const titleStyles = {
  fontWeight: 800,
  color: "text.primary",
  letterSpacing: "-0.02em",
};

export const subtitleStyles = {
  color: "text.secondary",
  maxWidth: 600,
};

export const dashboardGridStyles = {
  display: "grid",
  gridTemplateColumns: {
    xs: "1fr",
    md: "repeat(2, 1fr)",
    lg: "repeat(3, 1fr)",
  },
  gap: 3,
  alignItems: "flex-start",
};
