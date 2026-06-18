#!/usr/bin/env bash
# 디자인 토큰을 design-system 레포(private)에서 인증으로 가져온다.
# - GitHub CLI(gh)의 인증을 사용 (로컬: gh auth login / CI: GH_TOKEN 시크릿).
# - 가져오기에 실패하거나 응답이 CSS가 아니면 기존 커밋본을 그대로 유지한다
#   (예전 unauthenticated curl 은 404 본문을 그대로 덮어써 토큰을 깨뜨렸음).
set -uo pipefail

REPO="twavetech-frontend/design-system"
mkdir -p styles public

fetch() {
  local path="$1" out="$2" tmp
  tmp="$(mktemp)"
  if gh api "repos/$REPO/contents/$path" -H "Accept: application/vnd.github.raw" > "$tmp" 2>/dev/null \
     && [ -s "$tmp" ] \
     && head -1 "$tmp" | grep -qE '/\*|--'; then
    mv "$tmp" "$out"
    echo "  ✓ $out"
    return 0
  fi
  rm -f "$tmp"
  if [ -f "$out" ]; then
    echo "  ⚠️  $path 가져오기 실패 — 기존 $out 유지 (gh 인증/접근 권한 확인)"
    return 0
  fi
  echo "  ✗ $path 가져오기 실패, 로컬 사본도 없음" >&2
  return 1
}

fetch "web/tokens.css" "styles/tokens.css" || exit 1
fetch "web/tokens-dark.css" "styles/tokens-dark.css" || exit 1

cp styles/tokens.css public/tokens.css
cp styles/tokens-dark.css public/tokens-dark.css
echo "✅ 토큰 동기화 완료"
