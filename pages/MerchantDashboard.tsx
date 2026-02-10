
import React, { useState, useEffect } from 'react';
import { Hotel, HotelStatus, User, RoomTypeDetail } from '../types';
import { storageService } from '../services/storageService';
import { Button, Input, Label, Card } from '../components/UI';
import { INITIAL_ROOM_TYPES, INITIAL_FACILITIES, INITIAL_TAGS, WINDOW_TYPES, HOTEL_GRADES } from '../constants';
import { Plus, Edit2, CheckCircle, Clock, XCircle, Ban, Trash2, Image as ImageIcon, Building2, X } from 'lucide-react';

export const MerchantDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Partial<Hotel>>({});

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = () => {
    const allHotels = storageService.getHotels();
    setHotels(allHotels.filter(h => h.merchantId === user.id));
  };

  const handleCreate = () => {
    // Explicitly reset all fields to ensure no state pollution between creations
    setCurrentHotel({
      id: `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      nameCn: '',
      nameEn: '',
      city: '',
      district: '',
      address: '',
      stars: 5,
      bannerImages: [],
      grade: HOTEL_GRADES[0],
      tags: [],
      price: 0,
      openingDate: new Date().toISOString().split('T')[0],
      description: '',
      facilities: [],
      roomDetails: [],
      merchantId: user.id,
      status: HotelStatus.PENDING,
      createdAt: Date.now()
    });
    setIsEditing(true);
  };

  const handleEdit = (hotel: Hotel) => {
    setCurrentHotel({ ...hotel });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHotel.roomDetails || currentHotel.roomDetails.length === 0) {
      alert("请至少添加一种房型信息");
      return;
    }
    const minPrice = Math.min(...currentHotel.roomDetails.map(r => r.price));
    const hotelToSave = { 
      ...currentHotel, 
      price: minPrice,
      status: HotelStatus.PENDING,
      merchantId: user.id,
      createdAt: currentHotel.createdAt || Date.now() 
    } as Hotel;
    
    storageService.saveHotel(hotelToSave);
    loadHotels();
    setIsEditing(false);
  };

  const addRoomDetail = () => {
    const newRoom: RoomTypeDetail = {
      id: `room_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: INITIAL_ROOM_TYPES[0],
      price: 0,
      area: 25,
      bedCount: 1,
      window: '有窗',
      image: ''
    };
    setCurrentHotel(prev => ({
      ...prev,
      roomDetails: [...(prev.roomDetails || []), newRoom]
    }));
  };

  const updateRoomDetail = (id: string, updates: Partial<RoomTypeDetail>) => {
    setCurrentHotel(prev => ({
      ...prev,
      roomDetails: prev.roomDetails?.map(r => r.id === id ? { ...r, ...updates } : r)
    }));
  };

  const removeRoomDetail = (id: string) => {
    setCurrentHotel(prev => ({
      ...prev,
      roomDetails: prev.roomDetails?.filter(r => r.id !== id)
    }));
  };

  const handleMultiImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCurrentHotel(prev => ({
          ...prev,
          bannerImages: [...(prev.bannerImages || []), base64]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeBannerImage = (index: number) => {
    setCurrentHotel(prev => ({
      ...prev,
      bannerImages: prev.bannerImages?.filter((_, i) => i !== index)
    }));
  };

  const handleRoomImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        updateRoomDetail(id, { image: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const getStatusBadge = (status: HotelStatus) => {
    switch (status) {
      case HotelStatus.APPROVED:
        return <span className="flex items-center gap-1 text-accent"><CheckCircle size={14}/>已发布</span>;
      case HotelStatus.PENDING:
        return <span className="flex items-center gap-1 text-orange-500"><Clock size={14}/>审核中</span>;
      case HotelStatus.REJECTED:
        return <span className="flex items-center gap-1 text-danger"><XCircle size={14}/>不通过</span>;
      case HotelStatus.OFFLINE:
        return <span className="flex items-center gap-1 text-gray-400"><Ban size={14}/>已下线</span>;
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto p-6 animate-fade-in">
        <Card className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-borderLight pb-4">
            <h2 className="text-2xl font-bold text-primary">酒店全维度信息录入</h2>
            <Button variant="outline" onClick={() => setIsEditing(false)}>返回列表</Button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-8">
            <div className="space-y-4">
              <Label required>顶部 Banner 图 (多张)</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentHotel.bannerImages?.map((img, idx) => (
                  <div key={idx} className="relative h-32 rounded-lg overflow-hidden border border-borderLight group">
                    <img src={img} className="w-full h-full object-cover" alt={`Banner ${idx}`} />
                    <button 
                      type="button"
                      onClick={() => removeBannerImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-danger text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-borderLight flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Plus className="text-gray-400 mb-1" size={24} />
                  <span className="text-[10px] text-gray-400">添加图片</span>
                  <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleMultiImageUpload} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>酒店名 (中文)</Label>
                <Input value={currentHotel.nameCn} onChange={e => setCurrentHotel({...currentHotel, nameCn: e.target.value})} required placeholder="如：上海宝格丽酒店" />
              </div>
              <div>
                <Label required>酒店名 (英文)</Label>
                <Input value={currentHotel.nameEn} onChange={e => setCurrentHotel({...currentHotel, nameEn: e.target.value})} required placeholder="Bulgari Hotel Shanghai" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div><Label required>城市</Label><Input value={currentHotel.city} onChange={e => setCurrentHotel({...currentHotel, city: e.target.value})} required /></div>
                <div><Label required>区域</Label><Input value={currentHotel.district} onChange={e => setCurrentHotel({...currentHotel, district: e.target.value})} required /></div>
              </div>
              <div><Label required>详细地址</Label><Input value={currentHotel.address} onChange={e => setCurrentHotel({...currentHotel, address: e.target.value})} required /></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label required>星级等级</Label>
                <select className="w-full px-4 py-2 bg-white border border-borderLight rounded-md focus:ring-2 focus:ring-accent outline-none" value={currentHotel.stars} onChange={e => setCurrentHotel({...currentHotel, stars: parseInt(e.target.value)})}>
                  {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} 星级</option>)}
                </select>
              </div>
              <div><Label required>开业日期</Label><Input type="date" value={currentHotel.openingDate} onChange={e => setCurrentHotel({...currentHotel, openingDate: e.target.value})} required /></div>
            </div>

            <div className="space-y-4">
              <div>
                <Label required>酒店档次 (单选)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {HOTEL_GRADES.map(grade => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setCurrentHotel({...currentHotel, grade})}
                      className={`px-4 py-2 rounded-md text-sm border transition-all ${currentHotel.grade === grade ? 'bg-primary text-white border-primary shadow-md' : 'bg-white text-gray-500 border-borderLight hover:border-primary'}`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>快捷标签 (多选)</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {INITIAL_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const tags = currentHotel.tags || [];
                        const next = tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag];
                        setCurrentHotel({...currentHotel, tags: next});
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs border transition-all ${currentHotel.tags?.includes(tag) ? 'bg-secondary text-white border-secondary shadow-sm' : 'bg-white text-gray-500 border-borderLight hover:border-secondary'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-borderLight pb-2">
                <Label required>房型价格与详情</Label>
                <Button type="button" size="sm" variant="outline" onClick={addRoomDetail}><Plus size={14} className="mr-1" /> 添加房型</Button>
              </div>
              <div className="space-y-4">
                {currentHotel.roomDetails?.map((room) => (
                  <div key={room.id} className="p-4 border border-borderLight rounded-lg bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    <div className="md:col-span-2">
                      <Label>房型图</Label>
                      <div className="relative w-full h-16 bg-white border rounded flex items-center justify-center overflow-hidden">
                        {room.image ? <img src={room.image} className="w-full h-full object-cover" /> : <ImageIcon size={16} className="text-gray-300" />}
                        <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => handleRoomImageUpload(room.id, e)} />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label>房型名</Label>
                      <select className="w-full px-2 py-1.5 bg-white border border-borderLight rounded text-sm" value={room.name} onChange={e => updateRoomDetail(room.id, { name: e.target.value })}>
                        {INITIAL_ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label>价格 (￥)</Label>
                      <Input type="number" className="py-1" value={room.price} onChange={e => updateRoomDetail(room.id, { price: parseFloat(e.target.value) })} />
                    </div>
                    <div className="md:col-span-2">
                      <Label>面积 (㎡)</Label>
                      <Input type="number" className="py-1" value={room.area} onChange={e => updateRoomDetail(room.id, { area: parseFloat(e.target.value) })} />
                    </div>
                    <div className="md:col-span-1"><Label>床位</Label><Input type="number" className="py-1" value={room.bedCount} onChange={e => updateRoomDetail(room.id, { bedCount: parseInt(e.target.value) })} /></div>
                    <div className="md:col-span-2">
                      <Label>窗户</Label>
                      <select className="w-full px-2 py-1.5 bg-white border border-borderLight rounded text-sm" value={room.window} onChange={e => updateRoomDetail(room.id, { window: e.target.value })}>
                        {WINDOW_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="md:col-span-1 flex justify-end"><Button type="button" variant="danger" size="sm" className="mb-1" onClick={() => removeRoomDetail(room.id)}><Trash2 size={14} /></Button></div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex gap-4">
              <Button type="submit" size="lg" className="flex-1">提交审核</Button>
              <Button type="button" variant="outline" size="lg" className="flex-1" onClick={() => setIsEditing(false)}>取消</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">我的酒店资产</h1>
          <p className="text-gray-500 text-sm mt-1">您可以管理并录入多家酒店的信息和状态</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={18} className="mr-2" /> 新增酒店
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.length === 0 ? (
          <div className="col-span-full py-20 text-center text-gray-400 border-2 border-dashed border-borderLight rounded-lg bg-white">
            暂无酒店数据，点击右上角开始录入。
          </div>
        ) : (
          hotels.map(hotel => (
            <Card key={hotel.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-primary/5 relative">
                {hotel.bannerImages && hotel.bannerImages.length > 0 ? (
                   <img src={hotel.bannerImages[0]} className="w-full h-full object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center opacity-20"><Building2 size={48} className="text-primary" /></div>
                )}
                <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur rounded text-[10px] font-bold shadow-sm">
                  {hotel.city} · {hotel.district}
                </div>
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-primary truncate flex-1">{hotel.nameCn}</h3>
                  <div className="text-[10px] font-semibold">{getStatusBadge(hotel.status)}</div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] rounded font-bold">{hotel.grade}</span>
                  {hotel.tags?.slice(0, 2).map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-accent/10 text-accent text-[10px] rounded">{t}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>￥<span className="text-lg font-bold text-secondary">{hotel.price}</span> 起</span>
                  <span className="flex text-yellow-500">{'★'.repeat(hotel.stars)}</span>
                </div>
                <Button variant="outline" className="w-full" size="sm" onClick={() => handleEdit(hotel)}><Edit2 size={14} className="mr-1" /> 管理详情</Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
