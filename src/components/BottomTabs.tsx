import React, { useMemo } from 'react'
import { NavLink } from 'react-router-dom'
import { Pizza, Coffee, ShoppingBag } from 'lucide-react'
import { selectCartItemsCount } from '@/redux/stores/cartSlice'
import { useSelector } from 'react-redux'

interface NavItemProps {
  to: string
  Icon: React.ElementType
  label: string
  showBadge?: boolean
  badgeContent?: number
}

const NavItem: React.FC<NavItemProps> = React.memo(({ to, Icon, label, showBadge = false, badgeContent = 0 }) => (
  <NavLink to={to} className='flex-1'>
    {({ isActive }) => (
      <div
        className={`flex flex-col items-center justify-center py-2 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}
      >
        <div className='relative mb-1'>
          <Icon
            className={`w-7 h-7 ${isActive ? 'text-orange-500' : 'text-gray-400'}`}
            strokeWidth={isActive ? 2.5 : 2}
          />
          {showBadge && badgeContent > 0 && (
            <span className='absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-medium h-4 min-w-[16px] rounded-full flex items-center justify-center px-1'>
              {badgeContent > 99 ? '99+' : badgeContent}
            </span>
          )}
        </div>
        <span className={`text-xs ${isActive ? 'font-medium' : 'font-normal'}`}>{label}</span>
      </div>
    )}
  </NavLink>
))

NavItem.displayName = 'NavItem'

const BottomTabs: React.FC = () => {
  const cartItemsCount = useSelector(selectCartItemsCount)

  const navItems = useMemo(
    () => [
      { to: '/action/foods', Icon: Pizza, label: 'Đồ ăn' },
      { to: '/action/drinks', Icon: Coffee, label: 'Đồ uống' },
      { to: '/action/orders', Icon: ShoppingBag, label: 'Đơn hàng', showBadge: true, badgeContent: cartItemsCount }
    ],
    [cartItemsCount]
  )

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200'>
      <div className='flex items-stretch max-w-md mx-auto'>
        {navItems.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </div>
    </div>
  )
}

export default React.memo(BottomTabs)
