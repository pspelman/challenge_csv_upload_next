-- Update name
UPDATE test SET data = jsonb_set(data, '{name}', '"my-other-name"');

-- Replace the tags (as oppose to adding or removing tags):
UPDATE test SET data = jsonb_set(data, '{tags}', '["tag3", "tag4"]');

-- Replacing the second tag (0-indexed):
UPDATE test SET data = jsonb_set(data, '{tags,1}', '"tag5"');

-- Append a tag
UPDATE test SET data = jsonb_set(data, '{tags,999999999}', '"tag6"', true);

-- Remove last tag
UPDATE test SET data = data #- '{tags,-1}';

-- Complex update (delete the last tag, insert a new tag, and change the name):
UPDATE test SET data = jsonb_set(
        jsonb_set(data #- '{tags,-1}', '{tags,999999999}', '"tag3"', true),
        '{name}', '"my-other-name"');
