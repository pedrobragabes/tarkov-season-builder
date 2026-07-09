import "./globals.css";

export const metadata = {
  title: "Kord Breach Build Planner",
  description: "Unofficial Escape from Tarkov Season 1 modifier build planner."
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
