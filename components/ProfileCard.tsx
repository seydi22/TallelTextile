
import Image from 'next/image';
import React from 'react';

interface ProfileCardProps {
  imageUrl: string;
  name: string;
  title: string;
  bio: React.ReactNode;
  birthDate?: string;
  education?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ imageUrl, name, title, bio, birthDate, education }) => {
  return (
    <div className="profile-card">
      <div className="card-body">
        <div className="mb-6">
          <Image
            src={imageUrl}
            alt={`Photo de ${name}`}
            width={160}
            height={160}
            className="profile-image"
            priority
          />
        </div>
        <h3 className="profile-name">{name}</h3>
        <p className="profile-title">{title}</p>
        {birthDate && (
          <p className="text-sm text-brand-text-secondary mb-1">
            Né le {birthDate}
          </p>
        )}
        {education && (
          <p className="text-sm text-brand-text-secondary italic mb-4">
            {education}
          </p>
        )}
        <div className="profile-bio">
          {bio}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
