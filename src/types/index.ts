export type NavigationItem = {
  label: string;
  href: string;
};

export type ApiError = {
  error: {
    code: string;
    message: string;
  };
};

export type Profile = {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  city: string;
  college: string;
  interests: string[];
};
