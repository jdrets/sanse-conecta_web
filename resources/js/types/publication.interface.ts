export interface ICategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IPublication {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  description: string;
  image: string | null;
  likes_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
  };
  category?: ICategory;
}

export interface IPublicationLike {
  id: number;
  user_id: number;
  publication_id: number;
  created_at: string;
  updated_at: string;
}

