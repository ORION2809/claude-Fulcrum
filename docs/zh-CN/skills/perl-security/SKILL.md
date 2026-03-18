---
name: perl-security
description: Ã¥â€¦Â¨Ã©ÂÂ¢Ã§Å¡â€žPerlÃ¥Â®â€°Ã¥â€¦Â¨Ã¦Å’â€¡Ã¥Ââ€”Ã¯Â¼Å’Ã¦Â¶ÂµÃ§â€ºâ€“Ã¦Â±Â¡Ã¦Å¸â€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ£â‚¬ÂÃ¨Â¾â€œÃ¥â€¦Â¥Ã©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂÃ¥Â®â€°Ã¥â€¦Â¨Ã¨Â¿â€ºÃ§Â¨â€¹Ã¦â€°Â§Ã¨Â¡Å’Ã£â‚¬ÂDBIÃ¥Ââ€šÃ¦â€¢Â°Ã¥Å’â€“Ã¦Å¸Â¥Ã¨Â¯Â¢Ã£â‚¬ÂWebÃ¥Â®â€°Ã¥â€¦Â¨Ã¯Â¼Ë†XSS/SQLi/CSRFÃ¯Â¼â€°Ã¤Â»Â¥Ã¥ÂÅ perlcriticÃ¥Â®â€°Ã¥â€¦Â¨Ã§Â­â€“Ã§â€¢Â¥Ã£â‚¬â€š
origin: claude-fulcrum
---

# Perl Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Â¨Â¡Ã¥Â¼Â

Ã¦Â¶ÂµÃ§â€ºâ€“Ã¨Â¾â€œÃ¥â€¦Â¥Ã©ÂªÅ’Ã¨Â¯ÂÃ£â‚¬ÂÃ¦Â³Â¨Ã¥â€¦Â¥Ã©Â¢â€žÃ©ËœÂ²Ã¥â€™Å’Ã¥Â®â€°Ã¥â€¦Â¨Ã§Â¼â€“Ã§Â ÂÃ¥Â®Å¾Ã¨Â·ÂµÃ§Å¡â€ž Perl Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¥â€¦Â¨Ã©ÂÂ¢Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Å’â€¡Ã¥Ââ€”Ã£â‚¬â€š

## Ã¤Â½â€¢Ã¦â€”Â¶Ã¥ÂÂ¯Ã§â€Â¨

* Ã¥Â¤â€žÃ§Ââ€  Perl Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¤Â¸Â­Ã§Å¡â€žÃ§â€Â¨Ã¦Ë†Â·Ã¨Â¾â€œÃ¥â€¦Â¥Ã¦â€”Â¶
* Ã¦Å¾â€žÃ¥Â»Âº Perl Web Ã¥Âºâ€Ã§â€Â¨Ã§Â¨â€¹Ã¥ÂºÂÃ¦â€”Â¶Ã¯Â¼Ë†CGIÃ£â‚¬ÂMojoliciousÃ£â‚¬ÂDancer2Ã£â‚¬ÂCatalystÃ¯Â¼â€°
* Ã¥Â®Â¡Ã¦Å¸Â¥ Perl Ã¤Â»Â£Ã§Â ÂÃ¤Â¸Â­Ã§Å¡â€žÃ¥Â®â€°Ã¥â€¦Â¨Ã¦Â¼ÂÃ¦Â´Å¾Ã¦â€”Â¶
* Ã¤Â½Â¿Ã§â€Â¨Ã§â€Â¨Ã¦Ë†Â·Ã¦ÂÂÃ¤Â¾â€ºÃ§Å¡â€žÃ¨Â·Â¯Ã¥Â¾â€žÃ¦â€°Â§Ã¨Â¡Å’Ã¦â€“â€¡Ã¤Â»Â¶Ã¦â€œÂÃ¤Â½Å“Ã¦â€”Â¶
* Ã¤Â»Å½ Perl Ã¦â€°Â§Ã¨Â¡Å’Ã§Â³Â»Ã§Â»Å¸Ã¥â€˜Â½Ã¤Â»Â¤Ã¦â€”Â¶
* Ã§Â¼â€“Ã¥â€ â„¢ DBI Ã¦â€¢Â°Ã¦ÂÂ®Ã¥Âºâ€œÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¦â€”Â¶

## Ã¥Â·Â¥Ã¤Â½Å“Ã¥Å½Å¸Ã§Ââ€ 

Ã¤Â»Å½Ã¦Â±Â¡Ã¦Å¸â€œÃ¦â€žÅ¸Ã§Å¸Â¥Ã§Å¡â€žÃ¨Â¾â€œÃ¥â€¦Â¥Ã¨Â¾Â¹Ã§â€¢Å’Ã¥Â¼â‚¬Ã¥Â§â€¹Ã¯Â¼Å’Ã§â€žÂ¶Ã¥ÂÅ½Ã¥Ââ€˜Ã¥Â¤â€“Ã¦â€°Â©Ã¥Â±â€¢Ã¯Â¼Å¡Ã©ÂªÅ’Ã¨Â¯ÂÃ¥Â¹Â¶Ã¥â€¡â‚¬Ã¥Å’â€“Ã¨Â¾â€œÃ¥â€¦Â¥Ã¯Â¼Å’Ã¤Â¿ÂÃ¦Å’ÂÃ¦â€“â€¡Ã¤Â»Â¶Ã§Â³Â»Ã§Â»Å¸Ã¥â€™Å’Ã¨Â¿â€ºÃ§Â¨â€¹Ã¦â€°Â§Ã¨Â¡Å’Ã¥Ââ€”Ã©â„¢ÂÃ¯Â¼Å’Ã¥Â¹Â¶Ã¥Â¤â€žÃ¥Â¤â€žÃ¤Â½Â¿Ã§â€Â¨Ã¥Ââ€šÃ¦â€¢Â°Ã¥Å’â€“Ã§Å¡â€ž DBI Ã¦Å¸Â¥Ã¨Â¯Â¢Ã£â‚¬â€šÃ¤Â¸â€¹Ã©ÂÂ¢Ã§Å¡â€žÃ§Â¤ÂºÃ¤Â¾â€¹Ã¥Â±â€¢Ã§Â¤ÂºÃ¤Âºâ€ Ã¥Å“Â¨Ã¤ÂºÂ¤Ã¤Â»ËœÃ¦Â¶â€°Ã¥ÂÅ Ã§â€Â¨Ã¦Ë†Â·Ã¨Â¾â€œÃ¥â€¦Â¥Ã£â‚¬Âshell Ã¦Ë†â€“Ã§Â½â€˜Ã§Â»Å“Ã§Å¡â€ž Perl Ã¤Â»Â£Ã§Â ÂÃ¤Â¹â€¹Ã¥â€°ÂÃ¯Â¼Å’Ã¦Â­Â¤Ã¦Å â‚¬Ã¨Æ’Â½Ã¦Å“Å¸Ã¦Å“â€ºÃ¦â€šÂ¨Ã¥Âºâ€Ã§â€Â¨Ã§Å¡â€žÃ¥Â®â€°Ã¥â€¦Â¨Ã©Â»ËœÃ¨Â®Â¤Ã¥ÂÅ¡Ã¦Â³â€¢Ã£â‚¬â€š

## Ã¦Â±Â¡Ã¦Å¸â€œÃ¦Â¨Â¡Ã¥Â¼Â

Perl Ã§Å¡â€žÃ¦Â±Â¡Ã¦Å¸â€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Ë†`-T`Ã¯Â¼â€°Ã¨Â·Å¸Ã¨Â¸ÂªÃ¦ÂÂ¥Ã¨â€¡ÂªÃ¥Â¤â€“Ã©Æ’Â¨Ã¦ÂºÂÃ§Å¡â€žÃ¦â€¢Â°Ã¦ÂÂ®Ã¯Â¼Å’Ã¥Â¹Â¶Ã©ËœÂ²Ã¦Â­Â¢Ã¥â€¦Â¶Ã¥Å“Â¨Ã¦Å“ÂªÃ§Â»ÂÃ¦ËœÅ½Ã§Â¡Â®Ã©ÂªÅ’Ã¨Â¯ÂÃ§Å¡â€žÃ¦Æ’â€¦Ã¥â€ ÂµÃ¤Â¸â€¹Ã§â€Â¨Ã¤ÂºÅ½Ã¤Â¸ÂÃ¥Â®â€°Ã¥â€¦Â¨Ã¦â€œÂÃ¤Â½Å“Ã£â‚¬â€š

### Ã¥ÂÂ¯Ã§â€Â¨Ã¦Â±Â¡Ã¦Å¸â€œÃ¦Â¨Â¡Ã¥Â¼Â

```perl
#!/usr/bin/perl -T
use v5.36;

# Tainted: anything from outside the program
my $input    = $ARGV[0];        # Tainted
my $env_path = $ENV{PATH};      # Tainted
my $form     = <STDIN>;         # Tainted
my $query    = $ENV{QUERY_STRING}; # Tainted

# Sanitize PATH early (required in taint mode)
$ENV{PATH} = '/usr/local/bin:/usr/bin:/bin';
delete @ENV{qw(IFS CDPATH ENV BASH_ENV)};
```

### Ã¥â€¡â‚¬Ã¥Å’â€“Ã¦Â¨Â¡Ã¥Â¼Â

```perl
use v5.36;

# Good: Validate and untaint with a specific regex
sub untaint_username($input) {
    if ($input =~ /^([a-zA-Z0-9_]{3,30})$/) {
        return $1;  # $1 is untainted
    }
    die "Invalid username: must be 3-30 alphanumeric characters\n";
}

# Good: Validate and untaint a file path
sub untaint_filename($input) {
    if ($input =~ m{^([a-zA-Z0-9._-]+)$}) {
        return $1;
    }
    die "Invalid filename: contains unsafe characters\n";
}

# Bad: Overly permissive untainting (defeats the purpose)
sub bad_untaint($input) {
    $input =~ /^(.*)$/s;
    return $1;  # Accepts ANYTHING Ã¢â‚¬â€ pointless
}
```

## Ã¨Â¾â€œÃ¥â€¦Â¥Ã©ÂªÅ’Ã¨Â¯Â

### Ã¥â€¦ÂÃ¨Â®Â¸Ã¥Ë†â€”Ã¨Â¡Â¨Ã¤Â¼ËœÃ¤ÂºÅ½Ã©ËœÂ»Ã¦Â­Â¢Ã¥Ë†â€”Ã¨Â¡Â¨

```perl
use v5.36;

# Good: Allowlist Ã¢â‚¬â€ define exactly what's permitted
sub validate_sort_field($field) {
    my %allowed = map { $_ => 1 } qw(name email created_at updated_at);
    die "Invalid sort field: $field\n" unless $allowed{$field};
    return $field;
}

# Good: Validate with specific patterns
sub validate_email($email) {
    if ($email =~ /^([a-zA-Z0-9._%+-]+\@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/) {
        return $1;
    }
    die "Invalid email address\n";
}

sub validate_integer($input) {
    if ($input =~ /^(-?\d{1,10})$/) {
        return $1 + 0;  # Coerce to number
    }
    die "Invalid integer\n";
}

# Bad: Blocklist Ã¢â‚¬â€ always incomplete
sub bad_validate($input) {
    die "Invalid" if $input =~ /[<>"';&|]/;  # Misses encoded attacks
    return $input;
}
```

### Ã©â€¢Â¿Ã¥ÂºÂ¦Ã§ÂºÂ¦Ã¦ÂÅ¸

```perl
use v5.36;

sub validate_comment($text) {
    die "Comment is required\n"        unless length($text) > 0;
    die "Comment exceeds 10000 chars\n" if length($text) > 10_000;
    return $text;
}
```

## Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Â­Â£Ã¥Ë†â„¢Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼Â

### Ã©ËœÂ²Ã¦Â­Â¢Ã¦Â­Â£Ã¥Ë†â„¢Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼ÂÃ¦â€¹â€™Ã§Â»ÂÃ¦Å“ÂÃ¥Å Â¡

Ã¥ÂµÅ’Ã¥Â¥â€”Ã§Å¡â€žÃ©â€¡ÂÃ¨Â¯ÂÃ¥Âºâ€Ã§â€Â¨Ã¤ÂºÅ½Ã©â€¡ÂÃ¥ÂÂ Ã¦Â¨Â¡Ã¥Â¼ÂÃ¦â€”Â¶Ã¤Â¼Å¡Ã¥Ââ€˜Ã§â€Å¸Ã§ÂÂ¾Ã©Å¡Â¾Ã¦â‚¬Â§Ã¥â€ºÅ¾Ã¦ÂºÂ¯Ã£â‚¬â€š

```perl
use v5.36;

# Bad: Vulnerable to ReDoS (exponential backtracking)
my $bad_re = qr/^(a+)+$/;           # Nested quantifiers
my $bad_re2 = qr/^([a-zA-Z]+)*$/;   # Nested quantifiers on class
my $bad_re3 = qr/^(.*?,){10,}$/;    # Repeated greedy/lazy combo

# Good: Rewrite without nesting
my $good_re = qr/^a+$/;             # Single quantifier
my $good_re2 = qr/^[a-zA-Z]+$/;     # Single quantifier on class

# Good: Use possessive quantifiers or atomic groups to prevent backtracking
my $safe_re = qr/^[a-zA-Z]++$/;             # Possessive (5.10+)
my $safe_re2 = qr/^(?>a+)$/;                # Atomic group

# Good: Enforce timeout on untrusted patterns
use POSIX qw(alarm);
sub safe_match($string, $pattern, $timeout = 2) {
    my $matched;
    eval {
        local $SIG{ALRM} = sub { die "Regex timeout\n" };
        alarm($timeout);
        $matched = $string =~ $pattern;
        alarm(0);
    };
    alarm(0);
    die $@ if $@;
    return $matched;
}
```

## Ã¥Â®â€°Ã¥â€¦Â¨Ã§Å¡â€žÃ¦â€“â€¡Ã¤Â»Â¶Ã¦â€œÂÃ¤Â½Å“

### Ã¤Â¸â€°Ã¥Ââ€šÃ¦â€¢Â° Open

```perl
use v5.36;

# Good: Three-arg open, lexical filehandle, check return
sub read_file($path) {
    open my $fh, '<:encoding(UTF-8)', $path
        or die "Cannot open '$path': $!\n";
    local $/;
    my $content = <$fh>;
    close $fh;
    return $content;
}

# Bad: Two-arg open with user data (command injection)
sub bad_read($path) {
    open my $fh, $path;        # If $path = "|rm -rf /", runs command!
    open my $fh, "< $path";   # Shell metacharacter injection
}
```

### Ã©ËœÂ²Ã¦Â­Â¢Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã¦â€”Â¶Ã©â€”Â´Ã¥â€™Å’Ã¨Â·Â¯Ã¥Â¾â€žÃ©ÂÂÃ¥Å½â€ 

```perl
use v5.36;
use Fcntl qw(:DEFAULT :flock);
use File::Spec;
use Cwd qw(realpath);

# Atomic file creation
sub create_file_safe($path) {
    sysopen(my $fh, $path, O_WRONLY | O_CREAT | O_EXCL, 0600)
        or die "Cannot create '$path': $!\n";
    return $fh;
}

# Validate path stays within allowed directory
sub safe_path($base_dir, $user_path) {
    my $real = realpath(File::Spec->catfile($base_dir, $user_path))
        // die "Path does not exist\n";
    my $base_real = realpath($base_dir)
        // die "Base dir does not exist\n";
    die "Path traversal blocked\n" unless $real =~ /^\Q$base_real\E(?:\/|\z)/;
    return $real;
}
```

Ã¤Â½Â¿Ã§â€Â¨ `File::Temp` Ã¥Â¤â€žÃ§Ââ€ Ã¤Â¸Â´Ã¦â€”Â¶Ã¦â€“â€¡Ã¤Â»Â¶Ã¯Â¼Ë†`tempfile(UNLINK => 1)`Ã¯Â¼â€°Ã¯Â¼Å’Ã¥Â¹Â¶Ã¤Â½Â¿Ã§â€Â¨ `flock(LOCK_EX)` Ã©ËœÂ²Ã¦Â­Â¢Ã§Â«Å¾Ã¦â‚¬ÂÃ¦ÂÂ¡Ã¤Â»Â¶Ã£â‚¬â€š

## Ã¥Â®â€°Ã¥â€¦Â¨Ã§Å¡â€žÃ¨Â¿â€ºÃ§Â¨â€¹Ã¦â€°Â§Ã¨Â¡Å’

### Ã¥Ë†â€”Ã¨Â¡Â¨Ã¥Â½Â¢Ã¥Â¼ÂÃ§Å¡â€ž system Ã¥â€™Å’ exec

```perl
use v5.36;

# Good: List form Ã¢â‚¬â€ no shell interpolation
sub run_command(@cmd) {
    system(@cmd) == 0
        or die "Command failed: @cmd\n";
}

run_command('grep', '-r', $user_pattern, '/var/log/app/');

# Good: Capture output safely with IPC::Run3
use IPC::Run3;
sub capture_output(@cmd) {
    my ($stdout, $stderr);
    run3(\@cmd, \undef, \$stdout, \$stderr);
    if ($?) {
        die "Command failed (exit $?): $stderr\n";
    }
    return $stdout;
}

# Bad: String form Ã¢â‚¬â€ shell injection!
sub bad_search($pattern) {
    system("grep -r '$pattern' /var/log/app/");  # If $pattern = "'; rm -rf / #"
}

# Bad: Backticks with interpolation
my $output = `ls $user_dir`;   # Shell injection risk
```

Ã¤Â¹Å¸Ã¥ÂÂ¯Ã¤Â»Â¥Ã¤Â½Â¿Ã§â€Â¨ `Capture::Tiny` Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Å“Â°Ã¦Ââ€¢Ã¨Å½Â·Ã¥Â¤â€“Ã©Æ’Â¨Ã¥â€˜Â½Ã¤Â»Â¤Ã§Å¡â€žÃ¦Â â€¡Ã¥â€¡â€ Ã¨Â¾â€œÃ¥â€¡ÂºÃ¥â€™Å’Ã¦Â â€¡Ã¥â€¡â€ Ã©â€â„¢Ã¨Â¯Â¯Ã£â‚¬â€š

## SQL Ã¦Â³Â¨Ã¥â€¦Â¥Ã©Â¢â€žÃ©ËœÂ²

### DBI Ã¥ÂÂ Ã¤Â½ÂÃ§Â¬Â¦

```perl
use v5.36;
use DBI;

my $dbh = DBI->connect($dsn, $user, $pass, {
    RaiseError => 1,
    PrintError => 0,
    AutoCommit => 1,
});

# Good: Parameterized queries Ã¢â‚¬â€ always use placeholders
sub find_user($dbh, $email) {
    my $sth = $dbh->prepare('SELECT * FROM users WHERE email = ?');
    $sth->execute($email);
    return $sth->fetchrow_hashref;
}

sub search_users($dbh, $name, $status) {
    my $sth = $dbh->prepare(
        'SELECT * FROM users WHERE name LIKE ? AND status = ? ORDER BY name'
    );
    $sth->execute("%$name%", $status);
    return $sth->fetchall_arrayref({});
}

# Bad: String interpolation in SQL (SQLi vulnerability!)
sub bad_find($dbh, $email) {
    my $sth = $dbh->prepare("SELECT * FROM users WHERE email = '$email'");
    # If $email = "' OR 1=1 --", returns all users
    $sth->execute;
    return $sth->fetchrow_hashref;
}
```

### Ã¥Å Â¨Ã¦â‚¬ÂÃ¥Ë†â€”Ã¥â€¦ÂÃ¨Â®Â¸Ã¥Ë†â€”Ã¨Â¡Â¨

```perl
use v5.36;

# Good: Validate column names against an allowlist
sub order_by($dbh, $column, $direction) {
    my %allowed_cols = map { $_ => 1 } qw(name email created_at);
    my %allowed_dirs = map { $_ => 1 } qw(ASC DESC);

    die "Invalid column: $column\n"    unless $allowed_cols{$column};
    die "Invalid direction: $direction\n" unless $allowed_dirs{uc $direction};

    my $sth = $dbh->prepare("SELECT * FROM users ORDER BY $column $direction");
    $sth->execute;
    return $sth->fetchall_arrayref({});
}

# Bad: Directly interpolating user-chosen column
sub bad_order($dbh, $column) {
    $dbh->prepare("SELECT * FROM users ORDER BY $column");  # SQLi!
}
```

### DBIx::ClassÃ¯Â¼Ë†ORM Ã¥Â®â€°Ã¥â€¦Â¨Ã¦â‚¬Â§Ã¯Â¼â€°

```perl
use v5.36;

# DBIx::Class generates safe parameterized queries
my @users = $schema->resultset('User')->search({
    status => 'active',
    email  => { -like => '%@example.com' },
}, {
    order_by => { -asc => 'name' },
    rows     => 50,
});
```

## Web Ã¥Â®â€°Ã¥â€¦Â¨

### XSS Ã©Â¢â€žÃ©ËœÂ²

```perl
use v5.36;
use HTML::Entities qw(encode_entities);
use URI::Escape qw(uri_escape_utf8);

# Good: Encode output for HTML context
sub safe_html($user_input) {
    return encode_entities($user_input);
}

# Good: Encode for URL context
sub safe_url_param($value) {
    return uri_escape_utf8($value);
}

# Good: Encode for JSON context
use JSON::MaybeXS qw(encode_json);
sub safe_json($data) {
    return encode_json($data);  # Handles escaping
}

# Template auto-escaping (Mojolicious)
# <%= $user_input %>   Ã¢â‚¬â€ auto-escaped (safe)
# <%== $raw_html %>    Ã¢â‚¬â€ raw output (dangerous, use only for trusted content)

# Template auto-escaping (Template Toolkit)
# [% user_input | html %]  Ã¢â‚¬â€ explicit HTML encoding

# Bad: Raw output in HTML
sub bad_html($input) {
    print "<div>$input</div>";  # XSS if $input contains <script>
}
```

### CSRF Ã¤Â¿ÂÃ¦Å Â¤

```perl
use v5.36;
use Crypt::URandom qw(urandom);
use MIME::Base64 qw(encode_base64url);

sub generate_csrf_token() {
    return encode_base64url(urandom(32));
}
```

Ã©ÂªÅ’Ã¨Â¯ÂÃ¤Â»Â¤Ã§â€°Å’Ã¦â€”Â¶Ã¤Â½Â¿Ã§â€Â¨Ã¦Ââ€™Ã¥Â®Å¡Ã¦â€”Â¶Ã©â€”Â´Ã¦Â¯â€Ã¨Â¾Æ’Ã£â‚¬â€šÃ¥Â¤Â§Ã¥Â¤Å¡Ã¦â€¢Â° Web Ã¦Â¡â€ Ã¦Å¾Â¶Ã¯Â¼Ë†MojoliciousÃ£â‚¬ÂDancer2Ã£â‚¬ÂCatalystÃ¯Â¼â€°Ã©Æ’Â½Ã¦ÂÂÃ¤Â¾â€ºÃ¥â€ â€¦Ã§Â½Â®Ã§Å¡â€ž CSRF Ã¤Â¿ÂÃ¦Å Â¤Ã¢â‚¬â€Ã¢â‚¬â€Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã¨Â¿â„¢Ã¤Âºâ€ºÃ¨â‚¬Å’Ã©ÂÅ¾Ã¨â€¡ÂªÃ¨Â¡Å’Ã¥Â®Å¾Ã§Å½Â°Ã§Å¡â€žÃ¨Â§Â£Ã¥â€ Â³Ã¦â€“Â¹Ã¦Â¡Ë†Ã£â‚¬â€š

### Ã¤Â¼Å¡Ã¨Â¯ÂÃ¥â€™Å’Ã¦Â â€¡Ã¥Â¤Â´Ã¥Â®â€°Ã¥â€¦Â¨

```perl
use v5.36;

# Mojolicious session + headers
$app->secrets(['long-random-secret-rotated-regularly']);
$app->sessions->secure(1);          # HTTPS only
$app->sessions->samesite('Lax');

$app->hook(after_dispatch => sub ($c) {
    $c->res->headers->header('X-Content-Type-Options' => 'nosniff');
    $c->res->headers->header('X-Frame-Options'        => 'DENY');
    $c->res->headers->header('Content-Security-Policy' => "default-src 'self'");
    $c->res->headers->header('Strict-Transport-Security' => 'max-age=31536000; includeSubDomains');
});
```

## Ã¨Â¾â€œÃ¥â€¡ÂºÃ§Â¼â€“Ã§Â Â

Ã¥Â§â€¹Ã§Â»Ë†Ã¦Â Â¹Ã¦ÂÂ®Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã¥Â¯Â¹Ã¨Â¾â€œÃ¥â€¡ÂºÃ¨Â¿â€ºÃ¨Â¡Å’Ã§Â¼â€“Ã§Â ÂÃ¯Â¼Å¡HTML Ã¤Â½Â¿Ã§â€Â¨ `HTML::Entities::encode_entities()`Ã¯Â¼Å’URL Ã¤Â½Â¿Ã§â€Â¨ `URI::Escape::uri_escape_utf8()`Ã¯Â¼Å’JSON Ã¤Â½Â¿Ã§â€Â¨ `JSON::MaybeXS::encode_json()`Ã£â‚¬â€š

## CPAN Ã¦Â¨Â¡Ã¥Ââ€”Ã¥Â®â€°Ã¥â€¦Â¨

* **Ã¥â€ºÂºÃ¥Â®Å¡Ã§â€°Ë†Ã¦Å“Â¬** Ã¥Å“Â¨ cpanfile Ã¤Â¸Â­Ã¯Â¼Å¡`requires 'DBI', '== 1.643';`
* **Ã¤Â¼ËœÃ¥â€¦Ë†Ã¤Â½Â¿Ã§â€Â¨Ã§Â»Â´Ã¦Å Â¤Ã¤Â¸Â­Ã§Å¡â€žÃ¦Â¨Â¡Ã¥Ââ€”**Ã¯Â¼Å¡Ã¥Å“Â¨ MetaCPAN Ã¤Â¸Å Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦Å“â‚¬Ã¦â€“Â°Ã¥Ââ€˜Ã¥Â¸Æ’Ã§â€°Ë†Ã¦Å“Â¬
* **Ã¦Å“â‚¬Ã¥Â°ÂÃ¥Å’â€“Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹**Ã¯Â¼Å¡Ã¦Â¯ÂÃ¤Â¸ÂªÃ¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹Ã©Æ’Â½Ã¦ËœÂ¯Ã¤Â¸â‚¬Ã¤Â¸ÂªÃ¦â€Â»Ã¥â€¡Â»Ã©ÂÂ¢

## Ã¥Â®â€°Ã¥â€¦Â¨Ã¥Â·Â¥Ã¥â€¦Â·

### perlcritic Ã¥Â®â€°Ã¥â€¦Â¨Ã§Â­â€“Ã§â€¢Â¥

```ini
# .perlcriticrc Ã¢â‚¬â€ security-focused configuration
severity = 3
theme = security + core

# Require three-arg open
[InputOutput::RequireThreeArgOpen]
severity = 5

# Require checked system calls
[InputOutput::RequireCheckedSyscalls]
functions = :builtins
severity = 4

# Prohibit string eval
[BuiltinFunctions::ProhibitStringyEval]
severity = 5

# Prohibit backtick operators
[InputOutput::ProhibitBacktickOperators]
severity = 4

# Require taint checking in CGI
[Modules::RequireTaintChecking]
severity = 5

# Prohibit two-arg open
[InputOutput::ProhibitTwoArgOpen]
severity = 5

# Prohibit bare-word filehandles
[InputOutput::ProhibitBarewordFileHandles]
severity = 5
```

### Ã¨Â¿ÂÃ¨Â¡Å’ perlcritic

```bash
# Check a file
perlcritic --severity 3 --theme security lib/MyApp/Handler.pm

# Check entire project
perlcritic --severity 3 --theme security lib/

# CI integration
perlcritic --severity 4 --theme security --quiet lib/ || exit 1
```

## Ã¥Â¿Â«Ã©â‚¬Å¸Ã¥Â®â€°Ã¥â€¦Â¨Ã¦Â£â‚¬Ã¦Å¸Â¥Ã¦Â¸â€¦Ã¥Ââ€¢

| Ã¦Â£â‚¬Ã¦Å¸Â¥Ã©Â¡Â¹ | Ã©Å“â‚¬Ã©ÂªÅ’Ã¨Â¯ÂÃ§Å¡â€žÃ¥â€ â€¦Ã¥Â®Â¹ |
|---|---|
| Ã¦Â±Â¡Ã¦Å¸â€œÃ¦Â¨Â¡Ã¥Â¼Â | CGI/web Ã¨â€žÅ¡Ã¦Å“Â¬Ã¤Â¸Å Ã¤Â½Â¿Ã§â€Â¨ `-T` Ã¦Â â€¡Ã¥Â¿â€” |
| Ã¨Â¾â€œÃ¥â€¦Â¥Ã©ÂªÅ’Ã¨Â¯Â | Ã¥â€¦ÂÃ¨Â®Â¸Ã¥Ë†â€”Ã¨Â¡Â¨Ã¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã©â€¢Â¿Ã¥ÂºÂ¦Ã©â„¢ÂÃ¥Ë†Â¶ |
| Ã¦â€“â€¡Ã¤Â»Â¶Ã¦â€œÂÃ¤Â½Å“ | Ã¤Â¸â€°Ã¥Ââ€šÃ¦â€¢Â° openÃ¯Â¼Å’Ã¨Â·Â¯Ã¥Â¾â€žÃ©ÂÂÃ¥Å½â€ Ã¦Â£â‚¬Ã¦Å¸Â¥ |
| Ã¨Â¿â€ºÃ§Â¨â€¹Ã¦â€°Â§Ã¨Â¡Å’ | Ã¥Ë†â€”Ã¨Â¡Â¨Ã¥Â½Â¢Ã¥Â¼ÂÃ§Å¡â€ž systemÃ¯Â¼Å’Ã¦â€”Â  shell Ã¦Ââ€™Ã¥â‚¬Â¼ |
| SQL Ã¦Å¸Â¥Ã¨Â¯Â¢ | DBI Ã¥ÂÂ Ã¤Â½ÂÃ§Â¬Â¦Ã¯Â¼Å’Ã§Â»ÂÃ¤Â¸ÂÃ¦Ââ€™Ã¥â‚¬Â¼ |
| HTML Ã¨Â¾â€œÃ¥â€¡Âº | `encode_entities()`Ã¯Â¼Å’Ã¦Â¨Â¡Ã¦ÂÂ¿Ã¨â€¡ÂªÃ¥Å Â¨Ã¨Â½Â¬Ã¤Â¹â€° |
| CSRF Ã¤Â»Â¤Ã§â€°Å’ | Ã§â€Å¸Ã¦Ë†ÂÃ¤Â»Â¤Ã§â€°Å’Ã¯Â¼Å’Ã¥Â¹Â¶Ã¥Å“Â¨Ã§Å Â¶Ã¦â‚¬ÂÃ¦â€ºÂ´Ã¦â€Â¹Ã¨Â¯Â·Ã¦Â±â€šÃ¦â€”Â¶Ã©ÂªÅ’Ã¨Â¯Â |
| Ã¤Â¼Å¡Ã¨Â¯ÂÃ©â€¦ÂÃ§Â½Â® | Ã¥Â®â€°Ã¥â€¦Â¨Ã£â‚¬ÂHttpOnlyÃ£â‚¬ÂSameSite Cookie |
| HTTP Ã¦Â â€¡Ã¥Â¤Â´ | CSPÃ£â‚¬ÂX-Frame-OptionsÃ£â‚¬ÂHSTS |
| Ã¤Â¾ÂÃ¨Âµâ€“Ã©Â¡Â¹ | Ã¥â€ºÂºÃ¥Â®Å¡Ã§â€°Ë†Ã¦Å“Â¬Ã¯Â¼Å’Ã¥Â·Â²Ã¥Â®Â¡Ã¨Â®Â¡Ã¦Â¨Â¡Ã¥Ââ€” |
| Ã¦Â­Â£Ã¥Ë†â„¢Ã¨Â¡Â¨Ã¨Â¾Â¾Ã¥Â¼ÂÃ¥Â®â€°Ã¥â€¦Â¨ | Ã¦â€”Â Ã¥ÂµÅ’Ã¥Â¥â€”Ã©â€¡ÂÃ¨Â¯ÂÃ¯Â¼Å’Ã©â€Å¡Ã¥Â®Å¡Ã¦Â¨Â¡Ã¥Â¼Â |
| Ã©â€â„¢Ã¨Â¯Â¯Ã¦Â¶Ë†Ã¦ÂÂ¯ | Ã¤Â¸ÂÃ¥Ââ€˜Ã§â€Â¨Ã¦Ë†Â·Ã¦Â³â€žÃ©Å“Â²Ã¥Â â€ Ã¦Â Ë†Ã¨Â·Å¸Ã¨Â¸ÂªÃ¦Ë†â€“Ã¨Â·Â¯Ã¥Â¾â€ž |

## Ã¥ÂÂÃ¦Â¨Â¡Ã¥Â¼Â

```perl
# 1. Two-arg open with user data (command injection)
open my $fh, $user_input;               # CRITICAL vulnerability

# 2. String-form system (shell injection)
system("convert $user_file output.png"); # CRITICAL vulnerability

# 3. SQL string interpolation
$dbh->do("DELETE FROM users WHERE id = $id");  # SQLi

# 4. eval with user input (code injection)
eval $user_code;                         # Remote code execution

# 5. Trusting $ENV without sanitizing
my $path = $ENV{UPLOAD_DIR};             # Could be manipulated
system("ls $path");                      # Double vulnerability

# 6. Disabling taint without validation
($input) = $input =~ /(.*)/s;           # Lazy untaint Ã¢â‚¬â€ defeats purpose

# 7. Raw user data in HTML
print "<div>Welcome, $username!</div>";  # XSS

# 8. Unvalidated redirects
print $cgi->redirect($user_url);         # Open redirect
```

**Ã¨Â¯Â·Ã¨Â®Â°Ã¤Â½Â**Ã¯Â¼Å¡Perl Ã§Å¡â€žÃ§ÂÂµÃ¦Â´Â»Ã¦â‚¬Â§Ã¥Â¾Ë†Ã¥Â¼ÂºÃ¥Â¤Â§Ã¯Â¼Å’Ã¤Â½â€ Ã©Å“â‚¬Ã¨Â¦ÂÃ§ÂºÂªÃ¥Â¾â€¹Ã£â‚¬â€šÃ¥Â¯Â¹Ã©ÂÂ¢Ã¥Ââ€˜ Web Ã§Å¡â€žÃ¤Â»Â£Ã§Â ÂÃ¤Â½Â¿Ã§â€Â¨Ã¦Â±Â¡Ã¦Å¸â€œÃ¦Â¨Â¡Ã¥Â¼ÂÃ¯Â¼Å’Ã¤Â½Â¿Ã§â€Â¨Ã¥â€¦ÂÃ¨Â®Â¸Ã¥Ë†â€”Ã¨Â¡Â¨Ã©ÂªÅ’Ã¨Â¯ÂÃ¦â€°â‚¬Ã¦Å“â€°Ã¨Â¾â€œÃ¥â€¦Â¥Ã¯Â¼Å’Ã¥Â¯Â¹Ã¦Â¯ÂÃ¤Â¸ÂªÃ¦Å¸Â¥Ã¨Â¯Â¢Ã¤Â½Â¿Ã§â€Â¨ DBI Ã¥ÂÂ Ã¤Â½ÂÃ§Â¬Â¦Ã¯Â¼Å’Ã¥Â¹Â¶Ã¦Â Â¹Ã¦ÂÂ®Ã¤Â¸Å Ã¤Â¸â€¹Ã¦â€“â€¡Ã¥Â¯Â¹Ã¦â€°â‚¬Ã¦Å“â€°Ã¨Â¾â€œÃ¥â€¡ÂºÃ¨Â¿â€ºÃ¨Â¡Å’Ã§Â¼â€“Ã§Â ÂÃ£â‚¬â€šÃ§ÂºÂµÃ¦Â·Â±Ã©ËœÂ²Ã¥Â¾Â¡Ã¢â‚¬â€Ã¢â‚¬â€Ã§Â»ÂÃ¤Â¸ÂÃ¤Â¾ÂÃ¨Âµâ€“Ã¥Ââ€¢Ã¤Â¸â‚¬Ã©ËœÂ²Ã¦Å Â¤Ã¥Â±â€šÃ£â‚¬â€š
