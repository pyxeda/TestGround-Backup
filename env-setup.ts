const envUrlMap = {
  dev: "https://dev-navigator.aiclub.world/",
  local: "http://localhost:3000",
  demo: "https://demo-navigator.aiclub.world/",
  staging: "https://staging-navigator.aiclub.world/",
  production: "https://navigator.pyxeda.ai",
} as const;

export function getBaseUrl(environment: string | undefined) {
  if (environment && environment in envUrlMap) {
    return envUrlMap[environment];
  }
  return envUrlMap.local;
}
