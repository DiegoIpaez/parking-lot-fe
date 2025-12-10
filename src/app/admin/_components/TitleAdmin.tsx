import ButtonCs from '@/components/ui/custom/ButtonCs';
import { ActionBtnProps } from '@/types';
import React from 'react';

type TitleAdminProps = {
  icon?: React.ReactNode | null;
  title: string;
  okBtnProps?: ActionBtnProps;
};

export default function TitleAdmin({
  icon = null,
  title,
  okBtnProps,
}: TitleAdminProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon} <h1 className='text-md font-semibold'>{title}</h1>
      </div>
      {okBtnProps && <ButtonCs {...okBtnProps} />}
    </div>
  );
}
