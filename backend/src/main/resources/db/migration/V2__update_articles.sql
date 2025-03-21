-- Add new columns
ALTER TABLE articles 
    ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS author_id INT;

-- Set default values for new columns
UPDATE articles SET like_count = 0 WHERE like_count IS NULL;
UPDATE articles SET is_published = false WHERE is_published IS NULL;

-- Clean up orphaned articles and set author_id
DELETE FROM article_tags WHERE article_id IN (
    SELECT id FROM articles WHERE user_id NOT IN (SELECT id FROM users)
);
DELETE FROM articles WHERE user_id NOT IN (SELECT id FROM users);
UPDATE articles SET author_id = user_id WHERE author_id IS NULL;

-- Add foreign key constraint
ALTER TABLE articles 
    ADD CONSTRAINT fk_articles_author 
    FOREIGN KEY (author_id) 
    REFERENCES users(id) 
    ON DELETE CASCADE;

-- Make author_id not nullable
ALTER TABLE articles MODIFY COLUMN author_id INT NOT NULL;