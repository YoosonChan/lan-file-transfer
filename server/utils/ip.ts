export function getIp() {
  const networkInterfaces = require('os').networkInterfaces();
  let wifiIp: string | null = null
  let otherIp: string | null = null

  Object.keys(networkInterfaces).forEach(interfaceName => {
    const interfaces = networkInterfaces[interfaceName];
    interfaces.forEach((item: any) => {
      // 只获取IPv4地址且非内部地址
      if (item.family === 'IPv4' && !item.internal) {
        // 优先获取无线网络地址(通常以 'wl' 或 'wi' 开头)
        if (interfaceName.toLowerCase().startsWith('wl') ||
          interfaceName.toLowerCase().startsWith('wi')) {
          wifiIp = item.address;
        } else if (!otherIp) {
          otherIp = item.address;
        }
      }
    });
  });
  // 如果有wifi地址则返回wifi地址，否则返回其他网络地址
  return wifiIp || otherIp || '127.0.0.1'
}