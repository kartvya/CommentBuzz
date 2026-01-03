let _navigate: ((path: string) => void) | null = null;

export const setNavigate = (fn: (path: string) => void) => {
  _navigate = fn;
};

export const navigateTo = (path: string) => {
  if (_navigate) _navigate(path);
};

