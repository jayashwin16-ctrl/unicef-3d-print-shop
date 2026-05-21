#!/usr/bin/env bash
# Run after: npx vercel login && npx vercel link
set -euo pipefail

cd "$(dirname "$0")/.."

if ! command -v vercel >/dev/null 2>&1; then
  echo "Install Vercel CLI: npm i -g vercel   OR   npx vercel login"
  exit 1
fi

SECRET="${CHECKOUT_SESSION_SECRET:-$(openssl rand -base64 32)}"

echo "Using CHECKOUT_SESSION_SECRET (save this somewhere safe):"
echo "$SECRET"
echo ""

read -r -p "CHECKOUT_ACCESS_CODE (5 digits, e.g. 48291): " ACCESS_CODE
if ! [[ "$ACCESS_CODE" =~ ^[0-9]{5}$ ]]; then
  echo "CHECKOUT_ACCESS_CODE must be exactly 5 digits."
  exit 1
fi

for env in production preview; do
  echo "Adding env vars to: $env"
  printf '%s' "$SECRET" | vercel env add CHECKOUT_SESSION_SECRET "$env" --force
  printf '%s' "$ACCESS_CODE" | vercel env add CHECKOUT_ACCESS_CODE "$env" --force
done

echo ""
echo "Redeploying production..."
vercel --prod

echo "Done. Share CHECKOUT_ACCESS_CODE only with allowed buyers."
