export const useMobile = (device: 'mobile' | 'desktop') => {
  const { isMobile, isTablet } = useDevice()
  const devices = {
    mobile: isMobile || isTablet,
    desktop: !isMobile && !isTablet,
  }

  return devices[device]
}
