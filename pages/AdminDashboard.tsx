
import React, { useState, useEffect } from 'react';
import { Hotel, HotelStatus, User } from '../types';
import { storageService } from '../services/storageService';
import { Button, Card, Label } from '../components/UI';
import { CheckCircle2, XCircle, Search, Info, Globe, MapPin, Star, Tag, LayoutGrid, Ruler, BedDouble, SquareArrowOutUpRight, Layers } from 'lucide-react';

export const AdminDashboard: React.FC<{ user: User }> = ({ user }) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = () => {
    setHotels(storageService.getHotels());
  };

  const filteredHotels = hotels.filter(h => 
    h.nameCn.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAudit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setRejectReason('');
    setIsAuditModalOpen(true);
  };

  const submitAudit = (pass: boolean) => {
    if (!selectedHotel) return;
    if (!pass && !rejectReason) {
      alert('请填写拒绝原因');
      return;
    }

    const status = pass ? HotelStatus.APPROVED : HotelStatus.REJECTED;
    storageService.updateHotelStatus(selectedHotel.id, status, rejectReason);
    loadHotels();
    setIsAuditModalOpen(false);
    setSelectedHotel(null);
  };

  const toggleStatus = (hotel: Hotel) => {
    const newStatus = hotel.status === HotelStatus.OFFLINE ? HotelStatus.APPROVED : HotelStatus.OFFLINE;
    storageService.updateHotelStatus(hotel.id, newStatus);
    loadHotels();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary">酒店审核发布中心</h1>
        <p className="text-gray-500 text-sm mt-1">深度审核酒店维度信息，确保平台内容真实合规。</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input className="w-full pl-10 pr-4 py-2 border border-borderLight rounded-md focus:ring-2 focus:ring-accent outline-none" placeholder="搜索酒店、城市..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-borderLight shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-borderLight">
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">酒店名称</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">星级/档次</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">价格</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider">状态</th>
              <th className="px-6 py-4 text-xs font-bold text-primary uppercase tracking-wider text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borderLight">
            {filteredHotels.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">暂无相关记录</td></tr>
            ) : (
              filteredHotels.map(hotel => (
                <tr key={hotel.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{hotel.nameCn}</div>
                    <div className="text-xs text-gray-400">{hotel.city} · {hotel.district}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{hotel.grade}</div>
                    <div className="text-xs text-yellow-500">{'★'.repeat(hotel.stars)}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary font-bold">￥{hotel.price} 起</td>
                  <td className="px-6 py-4">
                    {hotel.status === HotelStatus.PENDING && <span className="px-2 py-1 rounded text-[10px] font-bold bg-orange-100 text-orange-600">待审核</span>}
                    {hotel.status === HotelStatus.APPROVED && <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-100 text-green-600">已发布</span>}
                    {hotel.status === HotelStatus.REJECTED && <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-600">已驳回</span>}
                    {hotel.status === HotelStatus.OFFLINE && <span className="px-2 py-1 rounded text-[10px] font-bold bg-gray-100 text-gray-500">下线</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => handleAudit(hotel)}>审核详情</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isAuditModalOpen && selectedHotel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl p-0 overflow-hidden animate-slide-up shadow-2xl">
            <div className="bg-primary p-5 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><Layers size={20}/> 审核酒店内容</h3>
              <button onClick={() => setIsAuditModalOpen(false)} className="text-2xl">&times;</button>
            </div>
            
            <div className="p-8 max-h-[85vh] overflow-y-auto bg-white">
              <div className="flex gap-4 overflow-x-auto pb-4 mb-8">
                {selectedHotel.bannerImages?.map((img, idx) => (
                  <img key={idx} src={img} className="w-80 h-48 rounded-xl object-cover shrink-0 shadow-md" />
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="md:col-span-2 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-primary">{selectedHotel.nameCn}</h2>
                    <p className="text-gray-400 italic">{selectedHotel.nameEn}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-primary text-white rounded text-xs font-bold">{selectedHotel.grade}</span>
                    {selectedHotel.tags?.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded text-xs font-semibold flex items-center gap-1"><Tag size={12}/> {t}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start gap-2"><MapPin size={16} className="text-gray-400 mt-0.5" /><span>{selectedHotel.address}</span></div>
                    <div className="flex items-start gap-2"><Star size={16} className="text-yellow-500 mt-0.5" /><span>{selectedHotel.stars} 星级</span></div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl border border-borderLight">
                  <div className="text-xs text-gray-400 mb-1">最低价格</div>
                  <div className="text-3xl font-bold text-secondary mb-4">￥{selectedHotel.price} <span className="text-sm font-normal text-gray-400">/起</span></div>
                  <div className="text-xs text-gray-400 mb-1">开业日期</div>
                  <div className="text-sm font-semibold">{selectedHotel.openingDate}</div>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="font-bold text-primary mb-4 flex items-center gap-2"><LayoutGrid size={18}/> 房型信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedHotel.roomDetails?.map(room => (
                    <div key={room.id} className="flex border border-borderLight rounded-lg overflow-hidden bg-gray-50/50">
                      <div className="w-24 h-24 bg-gray-200 shrink-0">{room.image && <img src={room.image} className="w-full h-full object-cover" />}</div>
                      <div className="p-3 flex-1">
                        <div className="flex justify-between items-start mb-1"><span className="font-bold text-sm text-primary">{room.name}</span><span className="text-secondary font-bold text-sm">￥{room.price}</span></div>
                        <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1"><Ruler size={10}/> {room.area}㎡</span>
                          <span className="flex items-center gap-1"><BedDouble size={10}/> {room.bedCount}床</span>
                          <span className="flex items-center gap-1 font-semibold text-accent"><SquareArrowOutUpRight size={10}/> {room.window}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedHotel.status === HotelStatus.PENDING && (
                <div className="bg-bgMain p-6 rounded-xl border border-borderLight">
                  <h4 className="font-bold text-primary mb-4">审核结论</h4>
                  <textarea className="w-full px-4 py-3 bg-white border border-borderLight rounded-md focus:ring-2 focus:ring-accent outline-none h-24 mb-4 text-sm" placeholder="请输入审核反馈意见..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
                  <div className="flex gap-4">
                    <Button variant="primary" className="flex-1 py-3" onClick={() => submitAudit(true)}><CheckCircle2 size={18} className="mr-2" /> 通过并发布</Button>
                    <Button variant="danger" className="flex-1 py-3" onClick={() => submitAudit(false)}><XCircle size={18} className="mr-2" /> 驳回审核</Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
