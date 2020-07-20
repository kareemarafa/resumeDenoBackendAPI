export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
}

export interface Meta {
  id?: string;
  key: string;
  value: string;
  description: string;
}

export interface Experience {
  id?: string;
  role: string;
  role_description?: string[];
  company_name: string;
  company_website?: string;
  start_date: string;
  end_date?: string;
  current?: boolean;
  company_location: string;
}

export interface Education {
  id?: string;
  title: string;
  due_date: string;
  description: string;
  course_list?: number[];
}

export interface Course {
  id?: string;
  title: string;
  author: string;
  certificate_link: string;
}

export interface Skill {
  id?: string;
  title: string;
  progress: number;
}
