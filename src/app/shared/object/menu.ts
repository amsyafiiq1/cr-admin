import { Menu } from '../type/menu.interface';

const HomeMenu: Menu = {
  title: 'Home',
  icon: 'bi bi-house-fill text-info',
  link: '/',
};

const RunnerMenu: Menu = {
  title: 'Runner',
  icon: 'bi bi-person-walking text-success',
  link: '/runner',
};

const UserMenu: Menu = {
  title: 'User',
  icon: 'bi bi-person-fill text-primary',
  link: '/user',
};

const SettingMenu: Menu = {
  title: 'Setting',
  icon: 'bi bi-gear-fill text-error',
  link: '/setting',
};

export const MenuList: Menu[] = [HomeMenu, RunnerMenu, UserMenu, SettingMenu];
