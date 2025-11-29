-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- CATEGORIES TABLE
create table categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PRODUCTS TABLE
create table products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  sku text not null unique,
  category text not null, -- Storing name for simplicity, could be FK
  description text,
  price numeric default 0,
  cost numeric default 0,
  stock numeric default 0,
  min_stock numeric default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MOVEMENTS TABLE
create table movements (
  id uuid default uuid_generate_v4() primary key,
  product_id uuid references products(id) on delete cascade not null,
  type text not null check (type in ('IN', 'OUT')),
  quantity numeric not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  notes text
);

-- ASSEMBLIES TABLE (Recipes)
create table assemblies (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  product_id uuid references products(id) on delete cascade not null, -- The resulting product
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ASSEMBLY COMPONENTS TABLE (Ingredients)
create table assembly_components (
  id uuid default uuid_generate_v4() primary key,
  assembly_id uuid references assemblies(id) on delete cascade not null,
  component_id uuid references products(id) on delete cascade not null,
  quantity numeric not null
);

-- Insert default categories
insert into categories (name) values 
('General'), 
('Electrónica'), 
('Hogar'), 
('Materiales') 
on conflict do nothing;
