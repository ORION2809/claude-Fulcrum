---
name: perl-testing
description: Ã¤Â½Â¿Ã§â€Â¨Test2::V0Ã£â‚¬ÂTest::MoreÃ£â‚¬Âprove runnerÃ£â‚¬ÂÃ¦Â¨Â¡Ã¦â€¹Å¸Ã£â‚¬ÂDevel::CoverÃ¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¥â€™Å’TDDÃ¦â€“Â¹Ã¦Â³â€¢Ã§Å¡â€žPerlÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬â€š
origin: claude-fulcrum
---

# Perl Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Â¼Â

Ã¤Â½Â¿Ã§â€Â¨ Test2::V0Ã£â‚¬ÂTest::MoreÃ£â‚¬Âprove Ã¥â€™Å’ TDD Ã¦â€“Â¹Ã¦Â³â€¢Ã¨Â®ÂºÃ¤Â¸Âº Perl Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¦ÂÂÃ¤Â¾â€ºÃ¥â€¦Â¨Ã©ÂÂ¢Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã§Â­â€“Ã§â€¢Â¥Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¦Â¿â‚¬Ã¦Â´Â»

* Ã§Â¼â€“Ã¥â€ â„¢Ã¦â€“Â°Ã§Å¡â€ž Perl Ã¤Â»Â£Ã§Â ÂÃ¯Â¼Ë†Ã©ÂÂµÃ¥Â¾Âª TDDÃ¯Â¼Å¡Ã§ÂºÂ¢Ã£â‚¬ÂÃ§Â»Â¿Ã£â‚¬ÂÃ©â€¡ÂÃ¦Å¾â€žÃ¯Â¼â€°
* Ã¤Â¸Âº Perl Ã¦Â¨Â¡Ã¥Ââ€”Ã¦Ë†â€“Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¨Â®Â¾Ã¨Â®Â¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¥â€”Ã¤Â»Â¶
* Ã¥Â®Â¡Ã¦Å¸Â¥ Perl Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡
* Ã¨Â®Â¾Ã§Â½Â® Perl Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Å¸ÂºÃ§Â¡â‚¬Ã¨Â®Â¾Ã¦â€“Â½
* Ã¥Â°â€ Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â»Å½ Test::More Ã¨Â¿ÂÃ§Â§Â»Ã¥Ë†Â° Test2::V0
* Ã¨Â°Æ’Ã¨Â¯â€¢Ã¥Â¤Â±Ã¨Â´Â¥Ã§Å¡â€ž Perl Ã¦Âµâ€¹Ã¨Â¯â€¢

## TDD Ã¥Â·Â¥Ã¤Â½Å“Ã¦ÂµÂÃ§Â¨â€¹

Ã¥Â§â€¹Ã§Â»Ë†Ã©ÂÂµÃ¥Â¾Âª RED-GREEN-REFACTOR Ã¥Â¾ÂªÃ§Å½Â¯Ã£â‚¬â€š

```perl
# Step 1: RED Ã¢â‚¬â€ Write a failing test
# t/unit/calculator.t
use v5.36;
use Test2::V0;

use lib 'lib';
use Calculator;

subtest 'addition' => sub {
    my $calc = Calculator->new;
    is($calc->add(2, 3), 5, 'adds two numbers');
    is($calc->add(-1, 1), 0, 'handles negatives');
};

done_testing;

# Step 2: GREEN Ã¢â‚¬â€ Write minimal implementation
# lib/Calculator.pm
package Calculator;
use v5.36;
use Moo;

sub add($self, $a, $b) {
    return $a + $b;
}

1;

# Step 3: REFACTOR Ã¢â‚¬â€ Improve while tests stay green
# Run: prove -lv t/unit/calculator.t
```

## Test::More Ã¥Å¸ÂºÃ§Â¡â‚¬

Ã¦Â â€¡Ã¥â€¡â€ Ã§Å¡â€ž Perl Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¥Ââ€” Ã¢â‚¬â€Ã¢â‚¬â€ Ã¥Â¹Â¿Ã¦Â³â€ºÃ¤Â½Â¿Ã§â€Â¨Ã¯Â¼Å’Ã©Å¡ÂÃ¦Â Â¸Ã¥Â¿Æ’Ã¥Ââ€˜Ã¨Â¡Å’Ã£â‚¬â€š

### Ã¥Å¸ÂºÃ¦Å“Â¬Ã¦â€“Â­Ã¨Â¨â‚¬

```perl
use v5.36;
use Test::More;

# Plan upfront or use done_testing
# plan tests => 5;  # Fixed plan (optional)

# Equality
is($result, 42, 'returns correct value');
isnt($result, 0, 'not zero');

# Boolean
ok($user->is_active, 'user is active');
ok(!$user->is_banned, 'user is not banned');

# Deep comparison
is_deeply(
    $got,
    { name => 'Alice', roles => ['admin'] },
    'returns expected structure'
);

# Pattern matching
like($error, qr/not found/i, 'error mentions not found');
unlike($output, qr/password/, 'output hides password');

# Type check
isa_ok($obj, 'MyApp::User');
can_ok($obj, 'save', 'delete');

done_testing;
```

### SKIP Ã¥â€™Å’ TODO

```perl
use v5.36;
use Test::More;

# Skip tests conditionally
SKIP: {
    skip 'No database configured', 2 unless $ENV{TEST_DB};

    my $db = connect_db();
    ok($db->ping, 'database is reachable');
    is($db->version, '15', 'correct PostgreSQL version');
}

# Mark expected failures
TODO: {
    local $TODO = 'Caching not yet implemented';
    is($cache->get('key'), 'value', 'cache returns value');
}

done_testing;
```

## Test2::V0 Ã§Å½Â°Ã¤Â»Â£Ã¦Â¡â€ Ã¦Å¾Â¶

Test2::V0 Ã¦ËœÂ¯ Test::More Ã§Å¡â€žÃ§Å½Â°Ã¤Â»Â£Ã¦â€ºÂ¿Ã¤Â»Â£Ã¥â€œÂ Ã¢â‚¬â€Ã¢â‚¬â€ Ã¦â€ºÂ´Ã¤Â¸Â°Ã¥Â¯Å’Ã§Å¡â€žÃ¦â€“Â­Ã¨Â¨â‚¬Ã£â‚¬ÂÃ¦â€ºÂ´Ã¥Â¥Â½Ã§Å¡â€žÃ¨Â¯Å Ã¦â€“Â­Ã¥â€™Å’Ã¥ÂÂ¯Ã¦â€°Â©Ã¥Â±â€¢Ã¦â‚¬Â§Ã£â‚¬â€š

### Ã¤Â¸ÂºÃ¤Â»â‚¬Ã¤Â¹Ë†Ã©â‚¬â€°Ã¦â€¹Â© Test2Ã¯Â¼Å¸

* Ã¤Â½Â¿Ã§â€Â¨Ã¥â€œË†Ã¥Â¸Å’/Ã¦â€¢Â°Ã§Â»â€žÃ¦Å¾â€žÃ¥Â»ÂºÃ¥â„¢Â¨Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥Ââ€œÃ¨Â¶Å Ã§Å¡â€žÃ¦Â·Â±Ã¥Â±â€šÃ¦Â¯â€Ã¨Â¾Æ’
* Ã¥Â¤Â±Ã¨Â´Â¥Ã¦â€”Â¶Ã¦ÂÂÃ¤Â¾â€ºÃ¦â€ºÂ´Ã¥Â¥Â½Ã§Å¡â€žÃ¨Â¯Å Ã¦â€“Â­Ã¨Â¾â€œÃ¥â€¡Âº
* Ã¥â€¦Â·Ã¦Å“â€°Ã¦â€ºÂ´Ã¦Â¸â€¦Ã¦â„¢Â°Ã¤Â½Å“Ã§â€Â¨Ã¥Å¸Å¸Ã§Å¡â€žÃ¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢
* Ã¥ÂÂ¯Ã©â‚¬Å¡Ã¨Â¿â€¡ Test2::Tools::\* Ã¦Ââ€™Ã¤Â»Â¶Ã¦â€°Â©Ã¥Â±â€¢
* Ã¤Â¸Å½ Test::More Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Ââ€˜Ã¥ÂÅ½Ã¥â€¦Â¼Ã¥Â®Â¹

### Ã¤Â½Â¿Ã§â€Â¨Ã¦Å¾â€žÃ¥Â»ÂºÃ¥â„¢Â¨Ã¨Â¿â€ºÃ¨Â¡Å’Ã¦Â·Â±Ã¥Â±â€šÃ¦Â¯â€Ã¨Â¾Æ’

```perl
use v5.36;
use Test2::V0;

# Hash builder Ã¢â‚¬â€ check partial structure
is(
    $user->to_hash,
    hash {
        field name  => 'Alice';
        field email => match(qr/\@example\.com$/);
        field age   => validator(sub { $_ >= 18 });
        # Ignore other fields
        etc();
    },
    'user has expected fields'
);

# Array builder
is(
    $result,
    array {
        item 'first';
        item match(qr/^second/);
        item DNE();  # Does Not Exist Ã¢â‚¬â€ verify no extra items
    },
    'result matches expected list'
);

# Bag Ã¢â‚¬â€ order-independent comparison
is(
    $tags,
    bag {
        item 'perl';
        item 'testing';
        item 'tdd';
    },
    'has all required tags regardless of order'
);
```

### Ã¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢

```perl
use v5.36;
use Test2::V0;

subtest 'User creation' => sub {
    my $user = User->new(name => 'Alice', email => 'alice@example.com');
    ok($user, 'user object created');
    is($user->name, 'Alice', 'name is set');
    is($user->email, 'alice@example.com', 'email is set');
};

subtest 'User validation' => sub {
    my $warnings = warns {
        User->new(name => '', email => 'bad');
    };
    ok($warnings, 'warns on invalid data');
};

done_testing;
```

### Ã¤Â½Â¿Ã§â€Â¨ Test2 Ã¨Â¿â€ºÃ¨Â¡Å’Ã¥Â¼â€šÃ¥Â¸Â¸Ã¦Âµâ€¹Ã¨Â¯â€¢

```perl
use v5.36;
use Test2::V0;

# Test that code dies
like(
    dies { divide(10, 0) },
    qr/Division by zero/,
    'dies on division by zero'
);

# Test that code lives
ok(lives { divide(10, 2) }, 'division succeeds') or note($@);

# Combined pattern
subtest 'error handling' => sub {
    ok(lives { parse_config('valid.json') }, 'valid config parses');
    like(
        dies { parse_config('missing.json') },
        qr/Cannot open/,
        'missing file dies with message'
    );
};

done_testing;
```

## Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Â»â€žÃ§Â»â€¡Ã¤Â¸Å½ prove

### Ã§â€ºÂ®Ã¥Â½â€¢Ã§Â»â€œÃ¦Å¾â€ž

```text
t/
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ 00-load.t              # Verify modules compile
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ 01-basic.t             # Core functionality
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ unit/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ config.t           # Unit tests by module
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ user.t
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ util.t
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ integration/
Ã¢â€â€š   Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ database.t
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ api.t
Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ lib/
Ã¢â€â€š   Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ TestHelper.pm      # Shared test utilities
Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ fixtures/
    Ã¢â€Å“Ã¢â€â‚¬Ã¢â€â‚¬ config.json        # Test data files
    Ã¢â€â€Ã¢â€â‚¬Ã¢â€â‚¬ users.csv
```

### prove Ã¥â€˜Â½Ã¤Â»Â¤

```bash
# Run all tests
prove -l t/

# Verbose output
prove -lv t/

# Run specific test
prove -lv t/unit/user.t

# Recursive search
prove -lr t/

# Parallel execution (8 jobs)
prove -lr -j8 t/

# Run only failing tests from last run
prove -l --state=failed t/

# Colored output with timer
prove -l --color --timer t/

# TAP output for CI
prove -l --formatter TAP::Formatter::JUnit t/ > results.xml
```

### .proverc Ã©â€¦ÂÃ§Â½Â®

```text
-l
--color
--timer
-r
-j4
--state=save
```

## Ã¥Â¤Â¹Ã¥â€¦Â·Ã¤Â¸Å½Ã¨Â®Â¾Ã§Â½Â®/Ã¦â€¹â€ Ã¥ÂÂ¸

### Ã¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã©Å¡â€Ã§Â¦Â»

```perl
use v5.36;
use Test2::V0;
use File::Temp qw(tempdir);
use Path::Tiny;

subtest 'file processing' => sub {
    # Setup
    my $dir = tempdir(CLEANUP => 1);
    my $file = path($dir, 'input.txt');
    $file->spew_utf8("line1\nline2\nline3\n");

    # Test
    my $result = process_file("$file");
    is($result->{line_count}, 3, 'counts lines');

    # Teardown happens automatically (CLEANUP => 1)
};
```

### Ã¥â€¦Â±Ã¤ÂºÂ«Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Å Â©Ã¦â€°â€¹

Ã¥Â°â€ Ã¥ÂÂ¯Ã©â€¡ÂÃ§â€Â¨Ã§Å¡â€žÃ¥Å Â©Ã¦â€°â€¹Ã¦â€Â¾Ã¥Å“Â¨ `t/lib/TestHelper.pm` Ã¤Â¸Â­Ã¯Â¼Å’Ã¥Â¹Â¶Ã©â‚¬Å¡Ã¨Â¿â€¡ `use lib 't/lib'` Ã¥Å Â Ã¨Â½Â½Ã£â‚¬â€šÃ©â‚¬Å¡Ã¨Â¿â€¡ `Exporter` Ã¥Â¯Â¼Ã¥â€¡ÂºÃ¥Â·Â¥Ã¥Å½â€šÃ¥â€¡Â½Ã¦â€¢Â°Ã¯Â¼Å’Ã¤Â¾â€¹Ã¥Â¦â€š `create_test_db()`Ã£â‚¬Â`create_temp_dir()` Ã¥â€™Å’ `fixture_path()`Ã£â‚¬â€š

## Ã¦Â¨Â¡Ã¦â€¹Å¸

### Test::MockModule

```perl
use v5.36;
use Test2::V0;
use Test::MockModule;

subtest 'mock external API' => sub {
    my $mock = Test::MockModule->new('MyApp::API');

    # Good: Mock returns controlled data
    $mock->mock(fetch_user => sub ($self, $id) {
        return { id => $id, name => 'Mock User', email => 'mock@test.com' };
    });

    my $api = MyApp::API->new;
    my $user = $api->fetch_user(42);
    is($user->{name}, 'Mock User', 'returns mocked user');

    # Verify call count
    my $call_count = 0;
    $mock->mock(fetch_user => sub { $call_count++; return {} });
    $api->fetch_user(1);
    $api->fetch_user(2);
    is($call_count, 2, 'fetch_user called twice');

    # Mock is automatically restored when $mock goes out of scope
};

# Bad: Monkey-patching without restoration
# *MyApp::API::fetch_user = sub { ... };  # NEVER Ã¢â‚¬â€ leaks across tests
```

Ã¥Â¯Â¹Ã¤ÂºÅ½Ã¨Â½Â»Ã©â€¡ÂÃ§ÂºÂ§Ã§Å¡â€žÃ¦Â¨Â¡Ã¦â€¹Å¸Ã¥Â¯Â¹Ã¨Â±Â¡Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `Test::MockObject` Ã¥Ë†â€ºÃ¥Â»ÂºÃ¥ÂÂ¯Ã¦Â³Â¨Ã¥â€¦Â¥Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€ºÂ¿Ã¨ÂºÂ«Ã¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨ `->mock()` Ã¥Â¹Â¶Ã©ÂªÅ’Ã¨Â¯ÂÃ¨Â°Æ’Ã§â€Â¨ `->called_ok()`Ã£â‚¬â€š

## Ã¤Â½Â¿Ã§â€Â¨ Devel::Cover Ã¨Â¿â€ºÃ¨Â¡Å’Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¥Ë†â€ Ã¦Å¾Â

### Ã¨Â¿ÂÃ¨Â¡Å’Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¥Ë†â€ Ã¦Å¾Â

```bash
# Basic coverage report
cover -test

# Or step by step
perl -MDevel::Cover -Ilib t/unit/user.t
cover

# HTML report
cover -report html
open cover_db/coverage.html

# Specific thresholds
cover -test -report text | grep 'Total'

# CI-friendly: fail under threshold
cover -test && cover -report text -select '^lib/' \
  | perl -ne 'if (/Total.*?(\d+\.\d+)/) { exit 1 if $1 < 80 }'
```

### Ã©â€ºâ€ Ã¦Ë†ÂÃ¦Âµâ€¹Ã¨Â¯â€¢

Ã¥Â¯Â¹Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â½Â¿Ã§â€Â¨Ã¥â€ â€¦Ã¥Â­ËœÃ¤Â¸Â­Ã§Å¡â€ž SQLiteÃ¯Â¼Å’Ã¥Â¯Â¹ API Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â¨Â¡Ã¦â€¹Å¸ HTTP::TinyÃ£â‚¬â€š

```perl
use v5.36;
use Test2::V0;
use DBI;

subtest 'database integration' => sub {
    my $dbh = DBI->connect('dbi:SQLite:dbname=:memory:', '', '', {
        RaiseError => 1,
    });
    $dbh->do('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');

    $dbh->prepare('INSERT INTO users (name) VALUES (?)')->execute('Alice');
    my $row = $dbh->selectrow_hashref('SELECT * FROM users WHERE name = ?', undef, 'Alice');
    is($row->{name}, 'Alice', 'inserted and retrieved user');
};

done_testing;
```

## Ã¦Å“â‚¬Ã¤Â½Â³Ã¥Â®Å¾Ã¨Â·Âµ

### Ã¥Âºâ€Ã¥ÂÅ¡Ã¤Âºâ€¹Ã©Â¡Â¹

* **Ã©ÂÂµÃ¥Â¾Âª TDD**Ã¯Â¼Å¡Ã¥Å“Â¨Ã¥Â®Å¾Ã§Å½Â°Ã¤Â¹â€¹Ã¥â€°ÂÃ§Â¼â€“Ã¥â€ â„¢Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¯Â¼Ë†Ã§ÂºÂ¢-Ã§Â»Â¿-Ã©â€¡ÂÃ¦Å¾â€žÃ¯Â¼â€°
* **Ã¤Â½Â¿Ã§â€Â¨ Test2::V0**Ã¯Â¼Å¡Ã§Å½Â°Ã¤Â»Â£Ã¦â€“Â­Ã¨Â¨â‚¬Ã¯Â¼Å’Ã¦â€ºÂ´Ã¥Â¥Â½Ã§Å¡â€žÃ¨Â¯Å Ã¦â€“Â­
* **Ã¤Â½Â¿Ã§â€Â¨Ã¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢**Ã¯Â¼Å¡Ã¥Ë†â€ Ã§Â»â€žÃ§â€ºÂ¸Ã¥â€¦Â³Ã¦â€“Â­Ã¨Â¨â‚¬Ã¯Â¼Å’Ã©Å¡â€Ã§Â¦Â»Ã§Å Â¶Ã¦â‚¬Â
* **Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¥Â¤â€“Ã©Æ’Â¨Ã¤Â¾ÂÃ¨Âµâ€“**Ã¯Â¼Å¡Ã§Â½â€˜Ã§Â»Å“Ã£â‚¬ÂÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ£â‚¬ÂÃ¦â€“â€¡Ã¤Â»Â¶Ã§Â³Â»Ã§Â»Å¸
* **Ã¤Â½Â¿Ã§â€Â¨ `prove -l`**Ã¯Â¼Å¡Ã¥Â§â€¹Ã§Â»Ë†Ã¥Â°â€  lib/ Ã¥Å’â€¦Ã¥ÂÂ«Ã¥Å“Â¨ `@INC` Ã¤Â¸Â­
* **Ã¦Â¸â€¦Ã¦â„¢Â°Ã¥â€˜Â½Ã¥ÂÂÃ¦Âµâ€¹Ã¨Â¯â€¢**Ã¯Â¼Å¡`'user login with invalid password fails'`
* **Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¾Â¹Ã§â€¢Å’Ã¦Æ’â€¦Ã¥â€ Âµ**Ã¯Â¼Å¡Ã§Â©ÂºÃ¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã£â‚¬ÂundefÃ£â‚¬ÂÃ©â€ºÂ¶Ã£â‚¬ÂÃ¨Â¾Â¹Ã§â€¢Å’Ã¥â‚¬Â¼
* **Ã§â€ºÂ®Ã¦Â â€¡ 80%+ Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡**Ã¯Â¼Å¡Ã¤Â¸â€œÃ¦Â³Â¨Ã¤ÂºÅ½Ã¤Â¸Å¡Ã¥Å Â¡Ã©â‚¬Â»Ã¨Â¾â€˜Ã¨Â·Â¯Ã¥Â¾â€ž
* **Ã¤Â¿ÂÃ¦Å’ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¿Â«Ã©â‚¬Å¸**Ã¯Â¼Å¡Ã¦Â¨Â¡Ã¦â€¹Å¸ I/OÃ¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨Ã¥â€ â€¦Ã¥Â­ËœÃ¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œ

### Ã§Â¦ÂÃ¦Â­Â¢Ã¤Âºâ€¹Ã©Â¡Â¹

* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â®Å¾Ã§Å½Â°**Ã¯Â¼Å¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¡Å’Ã¤Â¸ÂºÃ¥â€™Å’Ã¨Â¾â€œÃ¥â€¡ÂºÃ¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¥â€ â€¦Ã©Æ’Â¨Ã§Â»â€ Ã¨Å â€š
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Å“Â¨Ã¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¹â€¹Ã©â€”Â´Ã¥â€¦Â±Ã¤ÂºÂ«Ã§Å Â¶Ã¦â‚¬Â**Ã¯Â¼Å¡Ã¦Â¯ÂÃ¤Â¸ÂªÃ¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã©Æ’Â½Ã¥Âºâ€Ã¦ËœÂ¯Ã§â€¹Â¬Ã§Â«â€¹Ã§Å¡â€ž
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¨Â·Â³Ã¨Â¿â€¡ `done_testing`**Ã¯Â¼Å¡Ã§Â¡Â®Ã¤Â¿ÂÃ¦â€°â‚¬Ã¦Å“â€°Ã¨Â®Â¡Ã¥Ë†â€™Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã©Æ’Â½Ã¥Â·Â²Ã¨Â¿ÂÃ¨Â¡Å’
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¨Â¿â€¡Ã¥ÂºÂ¦Ã¦Â¨Â¡Ã¦â€¹Å¸**Ã¯Â¼Å¡Ã¤Â»â€¦Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¨Â¾Â¹Ã§â€¢Å’Ã¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¨Â¢Â«Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€žÃ¤Â»Â£Ã§Â Â
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Å“Â¨Ã¦â€“Â°Ã©Â¡Â¹Ã§â€ºÂ®Ã¤Â¸Â­Ã¤Â½Â¿Ã§â€Â¨ `Test::More`**Ã¯Â¼Å¡Ã©Â¦â€“Ã©â‚¬â€° Test2::V0
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¥Â¿Â½Ã§â€¢Â¥Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¤Â±Ã¨Â´Â¥**Ã¯Â¼Å¡Ã¦â€°â‚¬Ã¦Å“â€°Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¿â€¦Ã©Â¡Â»Ã¥Å“Â¨Ã¥ÂË†Ã¥Â¹Â¶Ã¥â€°ÂÃ©â‚¬Å¡Ã¨Â¿â€¡
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ¦Âµâ€¹Ã¨Â¯â€¢ CPAN Ã¦Â¨Â¡Ã¥Ââ€”**Ã¯Â¼Å¡Ã§â€ºÂ¸Ã¤Â¿Â¡Ã¥Âºâ€œÃ¨Æ’Â½Ã¦Â­Â£Ã¥Â¸Â¸Ã¥Â·Â¥Ã¤Â½Å“
* **Ã¤Â¸ÂÃ¨Â¦ÂÃ§Â¼â€“Ã¥â€ â„¢Ã¨â€žâ€ Ã¥Â¼Â±Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢**Ã¯Â¼Å¡Ã©ÂÂ¿Ã¥â€¦ÂÃ¨Â¿â€¡Ã¥ÂºÂ¦Ã¥â€¦Â·Ã¤Â½â€œÃ§Å¡â€žÃ¥Â­â€”Ã§Â¬Â¦Ã¤Â¸Â²Ã¥Å’Â¹Ã©â€¦Â

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Ââ€šÃ¨â‚¬Æ’

| Ã¤Â»Â»Ã¥Å Â¡ | Ã¥â€˜Â½Ã¤Â»Â¤ / Ã¦Â¨Â¡Ã¥Â¼Â |
|---|---|
| Ã¨Â¿ÂÃ¨Â¡Å’Ã¦â€°â‚¬Ã¦Å“â€°Ã¦Âµâ€¹Ã¨Â¯â€¢ | `prove -lr t/` |
| Ã¨Â¯Â¦Ã§Â»â€ Ã¨Â¿ÂÃ¨Â¡Å’Ã¥Ââ€¢Ã¤Â¸ÂªÃ¦Âµâ€¹Ã¨Â¯â€¢ | `prove -lv t/unit/user.t` |
| Ã¥Â¹Â¶Ã¨Â¡Å’Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¨Â¿ÂÃ¨Â¡Å’ | `prove -lr -j8 t/` |
| Ã¨Â¦â€ Ã§â€ºâ€“Ã§Å½â€¡Ã¦Å Â¥Ã¥â€˜Å  | `cover -test && cover -report html` |
| Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§â€ºÂ¸Ã§Â­â€°Ã¦â‚¬Â§ | `is($got, $expected, 'label')` |
| Ã¦Â·Â±Ã¥Â±â€šÃ¦Â¯â€Ã¨Â¾Æ’ | `is($got, hash { field k => 'v'; etc() }, 'label')` |
| Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¥Â¼â€šÃ¥Â¸Â¸ | `like(dies { ... }, qr/msg/, 'label')` |
| Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦â€”Â Ã¥Â¼â€šÃ¥Â¸Â¸ | `ok(lives { ... }, 'label')` |
| Ã¦Â¨Â¡Ã¦â€¹Å¸Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¦â€“Â¹Ã¦Â³â€¢ | `Test::MockModule->new('Pkg')->mock(m => sub { ... })` |
| Ã¨Â·Â³Ã¨Â¿â€¡Ã¦Âµâ€¹Ã¨Â¯â€¢ | `SKIP: { skip 'reason', $count unless $cond; ... }` |
| TODO Ã¦Âµâ€¹Ã¨Â¯â€¢ | `TODO: { local $TODO = 'reason'; ... }` |

## Ã¥Â¸Â¸Ã¨Â§ÂÃ©â„¢Â·Ã©ËœÂ±

### Ã¥Â¿ËœÃ¨Â®Â° `done_testing`

```perl
# Bad: Test file runs but doesn't verify all tests executed
use Test2::V0;
is(1, 1, 'works');
# Missing done_testing Ã¢â‚¬â€ silent bugs if test code is skipped

# Good: Always end with done_testing
use Test2::V0;
is(1, 1, 'works');
done_testing;
```

### Ã§Â¼ÂºÃ¥Â°â€˜ `-l` Ã¦Â â€¡Ã¥Â¿â€”

```bash
# Bad: Modules in lib/ not found
prove t/unit/user.t
# Can't locate MyApp/User.pm in @INC

# Good: Include lib/ in @INC
prove -l t/unit/user.t
```

### Ã¨Â¿â€¡Ã¥ÂºÂ¦Ã¦Â¨Â¡Ã¦â€¹Å¸

Ã¦Â¨Â¡Ã¦â€¹Å¸*Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹*Ã¯Â¼Å’Ã¨â‚¬Å’Ã©ÂÅ¾Ã¨Â¢Â«Ã¦Âµâ€¹Ã¨Â¯â€¢Ã§Å¡â€žÃ¤Â»Â£Ã§Â ÂÃ£â‚¬â€šÃ¥Â¦â€šÃ¦Å¾Å“Ã¤Â½Â Ã§Å¡â€žÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥ÂÂªÃ©ÂªÅ’Ã¨Â¯ÂÃ¦Â¨Â¡Ã¦â€¹Å¸Ã¨Â¿â€Ã¥â€ºÅ¾Ã¤Âºâ€ Ã¤Â½Â Ã¥â€˜Å Ã¨Â¯â€°Ã¥Â®Æ’Ã§Å¡â€žÃ¥â€ â€¦Ã¥Â®Â¹Ã¯Â¼Å’Ã©â€šÂ£Ã¤Â¹Ë†Ã¥Â®Æ’Ã¤Â»â‚¬Ã¤Â¹Ë†Ã¤Â¹Å¸Ã¦Â²Â¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã£â‚¬â€š

### Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦Â±Â¡Ã¦Å¸â€œ

Ã¥Å“Â¨Ã¥Â­ÂÃ¦Âµâ€¹Ã¨Â¯â€¢Ã¥â€ â€¦Ã©Æ’Â¨Ã¤Â½Â¿Ã§â€Â¨ `my` Ã¥ÂËœÃ©â€¡Â Ã¢â‚¬â€Ã¢â‚¬â€ Ã¦Â°Â¸Ã¨Â¿Å“Ã¤Â¸ÂÃ¨Â¦ÂÃ§â€Â¨ `our` Ã¢â‚¬â€Ã¢â‚¬â€ Ã¤Â»Â¥Ã©ËœÂ²Ã¦Â­Â¢Ã§Å Â¶Ã¦â‚¬ÂÃ¥Å“Â¨Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¤Â¹â€¹Ã©â€”Â´Ã¦Â³â€žÃ¦Â¼ÂÃ£â‚¬â€š

**Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Ã¦Âµâ€¹Ã¨Â¯â€¢Ã¦ËœÂ¯Ã¤Â½Â Ã§Å¡â€žÃ¥Â®â€°Ã¥â€¦Â¨Ã§Â½â€˜Ã£â‚¬â€šÃ¤Â¿ÂÃ¦Å’ÂÃ¥Â®Æ’Ã¤Â»Â¬Ã¥Â¿Â«Ã©â‚¬Å¸Ã£â‚¬ÂÃ¤Â¸â€œÃ¦Â³Â¨Ã¥â€™Å’Ã§â€¹Â¬Ã§Â«â€¹Ã£â‚¬â€šÃ¦â€“Â°Ã©Â¡Â¹Ã§â€ºÂ®Ã¤Â½Â¿Ã§â€Â¨ Test2::V0Ã¯Â¼Å’Ã¨Â¿ÂÃ¨Â¡Å’Ã¤Â½Â¿Ã§â€Â¨ proveÃ¯Â¼Å’Ã©â€”Â®Ã¨Â´Â£Ã¤Â½Â¿Ã§â€Â¨ Devel::CoverÃ£â‚¬â€š
