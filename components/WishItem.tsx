import React from 'react';

interface WishItemProps {
  id: string;
  title: string;
  price: number;
  image: string;
  slug: string;
  stockAvailabillity: number;
}

const WishItem: React.FC<WishItemProps> = ({ id, title, price, image, slug, stockAvailabillity }) => {
  return (
    <div className="wish-item">
      {/* Placeholder content for WishItem */}
      <p>Wish Item: {title || 'Unknown Product'}</p>
      {/* Add more product details here as needed */}
    </div>
  );
};

export default WishItem;
