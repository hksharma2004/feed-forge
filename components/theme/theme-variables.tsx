import { ThemeConfigProps } from "@/types/utils/configs/theme";

function toCssVariables(colors: Record<string, string>) {
  return Object.entries(colors)
    .map(([key, value]) => `--${key}:${value};`)
    .join("");
}

export function ThemeVariables({
  themesConfig,
  colorTheme = "sunny",
}: {
  themesConfig: ThemeConfigProps;
  colorTheme?: string;
}) {
  const theme = themesConfig.find(({ name }) => name === colorTheme);

  if (!theme) {
    return null;
  }

  const css = `:root{${toCssVariables(theme.light)}}.dark{${toCssVariables(theme.dark)}}`;

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
