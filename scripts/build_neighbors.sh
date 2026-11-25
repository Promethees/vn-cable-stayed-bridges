#!/usr/bin/env bash
# Builds src/assets/neighbors.geo.json: land of every country EXCEPT Viet Nam, used to dim neighbours.
# Source: Natural Earth 1:50m Admin-0 countries (public domain), https://www.naturalearthdata.com/
# Usage: scripts/build_neighbors.sh path/to/ne_50m_admin_0_countries.geojson
# Safety: any small polygon lying inside the Hoàng Sa / Trường Sa boxes is dropped so the
# archipelagos are never dimmed. No Viet Nam boundary is produced.
set -euo pipefail
IN="${1:?path to ne_50m_admin_0_countries.geojson}"
npx --yes mapshaper@0.6.102 "$IN" \
  -filter 'ADM0_A3 != "VNM"' \
  -clip bbox=92,-3,128,30 \
  -explode \
  -filter-fields ADM0_A3 \
  -each 'b=this.bounds, inHS=(b[0]>=110.5&&b[2]<=113.5&&b[1]>=15&&b[3]<=18), inTS=(b[0]>=109.5&&b[2]<=116.5&&b[1]>=6&&b[3]<=12.5)' \
  -filter '!(inHS||inTS)' \
  -filter-fields ADM0_A3 \
  -dissolve ADM0_A3 \
  -simplify 50% keep-shapes \
  -o src/assets/neighbors.geo.json format=geojson precision=0.001 force
