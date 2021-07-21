INSERT INTO todo (title, completed, created_at) VALUES
  ('Learn Svelte', false, now() - interval '2 second'),
  ('Learn Docker', false, now() - interval '1 second'),
  ('Learn Graphql', true, now());
