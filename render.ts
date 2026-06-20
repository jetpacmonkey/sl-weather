import type { EnvValues } from './types.ts';

export default async function render({
  API_KEY,
  APPLICATION_KEY,
  DEVICE_ID,
}: EnvValues): Promise<string> {
  return `<html>
test
</html>
`;
}
