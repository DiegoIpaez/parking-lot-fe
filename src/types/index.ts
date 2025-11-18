export * from './models.type';
export * from './reponses.type';
export * from './dynamicForm.type';

export type LoginRequest = {
  email: string;
  password: string;
};

export type Dictionary<T> = { [key: string]: T };

export type SidebarMenuItemProps = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  children?: SidebarMenuItemProps[];
};
