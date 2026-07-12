#!/usr/bin/env bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== HSE Project System & Memory Optimizer ===${NC}"
echo -e "This script configures your Linux system's memory management and file watch limits"
echo -e "so that the Next.js dev server does not get terminated by the OS.\n"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo -e "${YELLOW}Please run this script with sudo:${NC}"
  echo -e "${GREEN}sudo bash $0${NC}\n"
  
  echo -e "${BLUE}Current Memory Status:${NC}"
  free -h
  echo ""
  echo -e "${BLUE}Current File Watch Limits:${NC}"
  echo -n "max_user_watches: "
  cat /proc/sys/fs/inotify/max_user_watches
  echo -n "max_user_instances: "
  cat /proc/sys/fs/inotify/max_user_instances
  echo ""
  exit 1
fi

echo -e "${YELLOW}[1/6] Configuring aggressive swapping (swappiness = 100)...${NC}"
sysctl -w vm.swappiness=100

echo -e "${YELLOW}[2/6] Disabling watermark boosting to prevent spurious OOM kills...${NC}"
sysctl -w vm.watermark_boost_factor=0

echo -e "${YELLOW}[3/6] Optimizing cache reclamation pressure...${NC}"
sysctl -w vm.vfs_cache_pressure=50

echo -e "${YELLOW}[4/6] Increasing file watch limit (fs.inotify.max_user_watches = 524288)...${NC}"
sysctl -w fs.inotify.max_user_watches=524288

echo -e "${YELLOW}[5/6] Increasing watch instance limit (fs.inotify.max_user_instances = 512)...${NC}"
sysctl -w fs.inotify.max_user_instances=512

echo -e "${YELLOW}[6/6] Freeing cached RAM (pagecache, dentries, inodes)...${NC}"
sync
echo 3 > /proc/sys/vm/drop_caches

echo -e "\n${GREEN}✓ System limits optimized successfully!${NC}"
echo -e "${BLUE}Updated Memory Status:${NC}"
free -h
echo -e "\n${BLUE}Updated File Watch Limits:${NC}"
echo -n "max_user_watches: "
cat /proc/sys/fs/inotify/max_user_watches
echo -n "max_user_instances: "
cat /proc/sys/fs/inotify/max_user_instances
echo -e "\n${GREEN}Now you can run 'npm run dev' in your frontend folder.${NC}"
