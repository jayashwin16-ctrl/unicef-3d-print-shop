#!/usr/bin/env bash
# Run after: npx vercel login && npx vercel link
# Sets required checkout env vars on Vercel (production + preview).
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

read -r -p "RESEND_API_KEY (re_...): " RESEND_KEY
read -r -p "RESEND_FROM_EMAIL [3D Prints for Good <onboarding@resend.dev>]: " RESEND_FROM
RESEND_FROM="${RESEND_FROM:-3D Prints for Good <onboarding@resend.dev>}"

for env in production preview; do
  echo "Adding env vars to: $env"
  printf '%s' "$SECRET" | vercel env add CHECKOUT_SESSION_SECRET "$env" --force
  printf '%s' "$RESEND_KEY" | vercel env add RESEND_API_KEY "$env" --force
  printf '%s' "$RESEND_FROM" | vercel env add RESEND_FROM_EMAIL "$env" --force
done

echo ""
echo "Redeploying production..."
vercel --prod

echo "Done. Test: curl https://YOUR_DOMAIN/api/ping"
