export interface Store {
  id: string;
  code: string;
  name: string;
  area: string | null;
  status: string;
  postcode: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  title: string;
  body: string;
  list_of_stores: string[];
  user_id: string;
  date_created: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}
