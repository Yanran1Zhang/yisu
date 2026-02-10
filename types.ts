
export enum UserRole {
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN'
}

export enum HotelStatus {
  PENDING = 'PENDING',    // 审核中
  APPROVED = 'APPROVED',   // 已通过
  REJECTED = 'REJECTED',   // 不通过
  OFFLINE = 'OFFLINE'      // 已下线
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  password?: string;
}

export interface RoomTypeDetail {
  id: string;
  name: string;
  price: number;
  image?: string;
  area: number;
  bedCount: number;
  window: string; // "有窗", "无窗", "部分有窗"
}

export interface Hotel {
  id: string;
  nameCn: string;
  nameEn: string;
  city: string;
  district: string;
  address: string;
  stars: number;
  bannerImages: string[]; 
  grade: string; // 档次 (单选): 超值平价, 经济型, 舒适型, 高档型
  tags: string[]; // 快捷标签 (多选): 自助洗衣, 山景房等
  price: number; 
  openingDate: string;
  description: string;
  facilities: string[];
  roomDetails: RoomTypeDetail[];
  merchantId: string;
  status: HotelStatus;
  rejectReason?: string;
  createdAt: number;
}
