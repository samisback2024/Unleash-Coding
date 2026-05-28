-- ============================================================
-- Unleash Coding – Migration 014
-- Real lesson content: Java, DevOps, Cloud, Security, Git,
-- Linux, API Engineering, Software Architecture, Testing,
-- Docker/K8s, Networking, OS, Distributed Systems, Performance
-- ============================================================

-- ============================================================
-- JAVA DEVELOPER – Module 1: Java Fundamentals
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Java Basics: Types, Methods, and OOP',
$$## Java Basics: Types, Methods, and OOP

Java is a statically-typed, object-oriented language. Every variable has a type declared at compile time, and all code lives inside classes.

### Primitive Types

```java
// Integer types:
byte   b = 127;           // 8-bit:  -128 to 127
short  s = 32767;         // 16-bit: -32,768 to 32,767
int    i = 2_147_483_647; // 32-bit: ±2.1 billion (most common)
long   l = 9_223_372_036_854_775_807L; // 64-bit

// Decimal types:
float  f = 3.14f;         // 32-bit (use 'f' suffix)
double d = 3.14159265;    // 64-bit (default for decimals)

// Other primitives:
char   c = 'A';           // 16-bit Unicode character
boolean flag = true;      // true or false
```

### Reference Types and Strings

```java
// String — immutable sequence of characters:
String name = "Alice";
String greeting = "Hello, " + name + "!";  // String concatenation

// String methods:
System.out.println(name.length());         // 5
System.out.println(name.toUpperCase());    // ALICE
System.out.println(name.charAt(0));        // A
System.out.println(name.substring(1, 3)); // li
System.out.println(name.contains("li"));  // true

// String.format (like printf):
String msg = String.format("Name: %s, Age: %d, Score: %.2f", "Alice", 25, 95.5);

// StringBuilder — mutable, efficient for building strings:
StringBuilder sb = new StringBuilder();
sb.append("Hello");
sb.append(", ");
sb.append("World");
String result = sb.toString();   // "Hello, World"
```

### Classes and Objects

```java
// Define a class:
public class Person {
    // Fields (instance variables):
    private String name;
    private int    age;

    // Constructor:
    public Person(String name, int age) {
        this.name = name;   // 'this' distinguishes field from parameter
        this.age  = age;
    }

    // Getter methods:
    public String getName() { return name; }
    public int    getAge()  { return age;  }

    // Setter methods:
    public void setName(String name) { this.name = name; }

    // Method:
    public String greet() {
        return String.format("Hi, I am %s and I am %d years old.", name, age);
    }

    // Override Object.toString():
    @Override
    public String toString() {
        return "Person{name='" + name + "', age=" + age + "}";
    }
}

// Use the class:
Person alice = new Person("Alice", 28);
System.out.println(alice.greet());        // Hi, I am Alice and I am 28 years old.
System.out.println(alice.getName());      // Alice
System.out.println(alice);               // Person{name='Alice', age=28}
```

### Inheritance and Polymorphism

```java
// Abstract base class:
public abstract class Animal {
    protected String name;

    public Animal(String name) {
        this.name = name;
    }

    // Abstract method — subclasses MUST implement this:
    public abstract String sound();

    // Concrete method — inherited as-is:
    public void introduce() {
        System.out.println("I am " + name + " and I say: " + sound());
    }
}

public class Dog extends Animal {
    public Dog(String name) {
        super(name);   // Call parent constructor
    }

    @Override
    public String sound() { return "Woof!"; }
}

public class Cat extends Animal {
    @Override
    public String sound() { return "Meow!"; }

    public Cat(String name) { super(name); }
}

// Polymorphism — treat different types uniformly:
List<Animal> animals = List.of(new Dog("Rex"), new Cat("Whiskers"));
for (Animal a : animals) {
    a.introduce();   // Each calls its own sound() implementation
}
// I am Rex and I say: Woof!
// I am Whiskers and I say: Meow!
```

### Interfaces

```java
// Interface defines a contract (all methods are public abstract by default):
public interface Drawable {
    void draw();
    default void printType() {
        System.out.println("I am a " + getClass().getSimpleName());
    }
}

public interface Resizable {
    void resize(double factor);
}

// A class can implement multiple interfaces:
public class Circle implements Drawable, Resizable {
    private double radius;

    public Circle(double radius) { this.radius = radius; }

    @Override
    public void draw() {
        System.out.printf("Drawing circle with radius %.2f%n", radius);
    }

    @Override
    public void resize(double factor) { this.radius *= factor; }
}
```$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'java-developer' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Java Collections and Generics',
$$## Java Collections and Generics

The Java Collections Framework provides generic data structures for storing, retrieving, and manipulating data.

### List — Ordered, Allows Duplicates

```java
import java.util.*;

// ArrayList — O(1) random access, O(n) insert/delete in middle:
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
names.add("Charlie");
names.add(1, "Dave");   // Insert at index 1

System.out.println(names.get(0));      // Alice
System.out.println(names.size());      // 4
System.out.println(names.contains("Bob"));  // true
names.remove("Dave");                  // Remove by value
names.remove(0);                       // Remove by index

// Sort:
Collections.sort(names);
names.sort(Comparator.naturalOrder());
names.sort(Comparator.comparingInt(String::length));  // Sort by length

// LinkedList — O(1) insert at head/tail, O(n) random access:
Deque<String> queue = new LinkedList<>();
queue.addFirst("first");
queue.addLast("last");
queue.pollFirst();   // Remove and return first
```

### Set — No Duplicates

```java
// HashSet — O(1) add/remove/contains, no ordering:
Set<String> set = new HashSet<>(Arrays.asList("apple", "banana", "apple"));
System.out.println(set.size());          // 2 (duplicate removed)

// LinkedHashSet — maintains insertion order:
Set<Integer> ordered = new LinkedHashSet<>(List.of(3, 1, 4, 1, 5));
System.out.println(ordered);             // [3, 1, 4, 5]

// TreeSet — always sorted, O(log n) operations:
Set<Integer> sorted = new TreeSet<>(List.of(5, 3, 1, 4, 2));
System.out.println(sorted.first());      // 1
System.out.println(sorted.last());       // 5
```

### Map — Key-Value Pairs

```java
// HashMap — O(1) average, unordered:
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob",   82);
scores.put("Carol", 91);

System.out.println(scores.get("Alice"));                    // 95
System.out.println(scores.getOrDefault("Dave", 0));        // 0
scores.putIfAbsent("Alice", 100);                          // Won't overwrite

// Iterate:
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.printf("%s: %d%n", entry.getKey(), entry.getValue());
}

// Modern Java (forEach with lambda):
scores.forEach((name, score) ->
    System.out.printf("%s: %d%n", name, score)
);

// Compute if absent (useful for grouping):
Map<String, List<String>> groups = new HashMap<>();
groups.computeIfAbsent("engineering", k -> new ArrayList<>()).add("Alice");
groups.computeIfAbsent("engineering", k -> new ArrayList<>()).add("Bob");
```

### Generics

Generics let you write type-safe code that works with any type:

```java
// Generic class:
public class Pair<A, B> {
    private final A first;
    private final B second;

    public Pair(A first, B second) {
        this.first  = first;
        this.second = second;
    }

    public A getFirst()  { return first;  }
    public B getSecond() { return second; }

    @Override
    public String toString() {
        return "(" + first + ", " + second + ")";
    }
}

Pair<String, Integer>   nameAge  = new Pair<>("Alice", 28);
Pair<Double, Boolean>   result   = new Pair<>(3.14, true);

// Generic method:
public static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) >= 0 ? a : b;
}

System.out.println(max(10, 20));         // 20
System.out.println(max("apple", "zen")); // zen

// Bounded wildcards:
public static double sumList(List<? extends Number> list) {
    return list.stream().mapToDouble(Number::doubleValue).sum();
}
sumList(List.of(1, 2, 3));          // Works with Integer
sumList(List.of(1.5, 2.5, 3.0));   // Works with Double
```

### Java Streams (Functional Pipeline)

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Filter and map:
List<Integer> evenSquares = numbers.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .collect(Collectors.toList());
// [4, 16, 36, 64, 100]

// Reduce:
int sum = numbers.stream()
    .reduce(0, Integer::sum);   // 55

// Grouping:
Map<String, List<Person>> byDept = people.stream()
    .collect(Collectors.groupingBy(Person::getDepartment));

// Statistics:
OptionalInt max = numbers.stream().mapToInt(Integer::intValue).max();
double avg = numbers.stream().mapToInt(Integer::intValue).average().orElse(0);
```$$,
  'reading', '40 min', 2, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'java-developer' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- DEVOPS ENGINEER – Module 2: Docker
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Docker: Images, Containers, and Dockerfile',
$$## Docker: Images, Containers, and Dockerfile

Docker packages applications with all their dependencies into portable containers that run consistently everywhere.

### Core Concepts

- **Image** — a read-only snapshot (filesystem + metadata). Like a class in OOP.
- **Container** — a running instance of an image. Like an object in OOP.
- **Layer** — each instruction in a Dockerfile creates a cached layer.
- **Registry** — storage for images (Docker Hub, ECR, GCR, etc.)

### Essential Docker Commands

```bash
# Images:
docker pull nginx:1.25         # Download an image
docker images                  # List local images
docker rmi nginx:1.25          # Remove an image
docker build -t myapp:1.0 .    # Build image from Dockerfile in current dir

# Containers:
docker run nginx               # Run a container
docker run -d -p 8080:80 nginx # Detached mode, map host:container port
docker run -it ubuntu bash     # Interactive mode with a shell
docker ps                      # List running containers
docker ps -a                   # List all containers (including stopped)
docker stop <id>               # Stop container gracefully (SIGTERM)
docker kill <id>               # Stop container immediately (SIGKILL)
docker rm <id>                 # Remove stopped container
docker logs <id>               # View container logs
docker logs -f <id>            # Follow logs in real-time
docker exec -it <id> sh        # Open a shell inside running container
docker inspect <id>            # Full JSON info about container

# System cleanup:
docker system prune            # Remove all unused containers, images, networks
```

### Writing a Production Dockerfile

A well-structured Dockerfile uses multi-stage builds to produce a minimal final image:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first (better layer caching)
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Final (minimal image)
FROM node:20-alpine AS production
WORKDIR /app

# Create a non-root user (security best practice):
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy only what we need from the builder stage:
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .

# Document the port (informational only):
EXPOSE 3000

# Health check:
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Use exec form (no shell — faster startup, proper signal handling):
CMD ["node", "src/index.js"]
```

### Layer Caching — The Most Important Optimization

Docker caches each layer. If a layer''s instruction and inputs haven''t changed, Docker reuses the cache.

```dockerfile
# BAD — copies everything first, npm ci runs on EVERY code change:
COPY . .
RUN npm ci

# GOOD — package files change rarely, so npm ci only runs when they do:
COPY package*.json ./
RUN npm ci              # Cached unless package.json changed
COPY . .                # Only this layer re-runs for code changes
```

### .dockerignore

Always create a `.dockerignore` to avoid copying unnecessary files into the image:

```
node_modules
.git
.env
.env.*
*.log
dist
coverage
.nyc_output
*.md
Dockerfile
.dockerignore
```

### Volumes — Persisting Data

```bash
# Named volume — managed by Docker:
docker run -d \
    -v postgres_data:/var/lib/postgresql/data \
    postgres:15

# Bind mount — map a host directory into container (for development):
docker run -d \
    -v $(pwd)/src:/app/src \   # Host path : container path
    -v $(pwd)/package.json:/app/package.json \
    myapp:dev

# Inspect a volume:
docker volume ls
docker volume inspect postgres_data
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'devops-engineer' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- DEVOPS ENGINEER – Module 3: CI/CD Pipelines
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'GitHub Actions: Building a CI/CD Pipeline',
$$## GitHub Actions: Building a CI/CD Pipeline

GitHub Actions automates your software workflow. Every push, PR, or tag can trigger tests, builds, and deployments automatically.

### Core Concepts

- **Workflow** — a YAML file in `.github/workflows/`
- **Trigger** (on) — what starts the workflow: push, pull_request, schedule, manual, etc.
- **Job** — a group of steps that run on the same runner machine
- **Step** — a single command or action
- **Action** — a reusable unit of automation (from GitHub Marketplace or your own)
- **Runner** — the machine that runs jobs (GitHub-hosted or self-hosted)

### A Complete CI Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: "20"

jobs:
  lint-and-type-check:
    name: Lint & Type Check
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run ESLint
        run: npm run lint

      - name: Run TypeScript check
        run: npm run type-check

  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest
    needs: lint-and-type-check   # Only run if lint passes

    services:
      # Spin up a PostgreSQL container for integration tests:
      postgres:
        image: postgres:15
        env:
          POSTGRES_DB:       test_db
          POSTGRES_USER:     postgres
          POSTGRES_PASSWORD: password
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run database migrations
        env:
          DATABASE_URL: postgres://postgres:password@localhost:5432/test_db
        run: npm run db:migrate

      - name: Run tests with coverage
        env:
          DATABASE_URL: postgres://postgres:password@localhost:5432/test_db
          NODE_ENV: test
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage/lcov.info

  build:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'push'   # Only on direct push, not PRs

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            myorg/myapp:latest
            myorg/myapp:${{ github.sha }}
          cache-from: type=gha
          cache-to:   type=gha,mode=max
```

### Deploy on Tag (Release Workflow)

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    tags:
      - "v*"   # Trigger on tags like v1.0.0, v2.3.1

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production   # Requires manual approval if configured

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to production
        env:
          DEPLOY_KEY:  ${{ secrets.PRODUCTION_DEPLOY_KEY }}
          SERVER_HOST: ${{ secrets.PRODUCTION_HOST }}
        run: |
          echo "Deploying version ${{ github.ref_name }}"
          ssh -i "$DEPLOY_KEY" user@"$SERVER_HOST" \
            "cd /app && docker compose pull && docker compose up -d"
```

### Secrets and Environment Variables

```yaml
# Access secrets (never echo them to logs):
- name: Connect to DB
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}   # Masked in logs
  run: npm run db:migrate

# Matrix builds — run tests across multiple versions:
strategy:
  matrix:
    node: [18, 20, 22]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node }}
```$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'devops-engineer' AND m.order_index = 3
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- CLOUD ENGINEER – Module 2: AWS Core Services
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'AWS Core Services: EC2, S3, RDS, IAM, Lambda',
$$## AWS Core Services: EC2, S3, RDS, IAM, Lambda

These five services are the foundation of almost every AWS architecture. Understanding them deeply unlocks everything else.

### IAM — Identity and Access Management

IAM controls who can do what in your AWS account. Always the first thing to set up.

```json
// IAM Policy — least privilege principle:
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::my-bucket/*"
        },
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::my-bucket"
        }
    ]
}
```

**IAM Best Practices:**
- Never use root account for day-to-day work
- Enable MFA on all human accounts
- Use IAM Roles for EC2 instances (not access keys embedded in code!)
- Grant minimum necessary permissions

### EC2 — Virtual Machines in the Cloud

```bash
# Launch an EC2 instance (via AWS CLI):
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.micro \
    --key-name my-key-pair \
    --security-group-ids sg-xxxxxxxx \
    --subnet-id subnet-xxxxxxxx \
    --iam-instance-profile Name=MyRole \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-server}]'

# Connect via SSH:
ssh -i ~/.ssh/my-key.pem ec2-user@<public-ip>

# User data script (runs on first boot):
aws ec2 run-instances \
    --user-data file://setup.sh \
    ...
```

**EC2 Key Concepts:**
- **Instance Types**: t3 (burstable), m5 (general), c5 (compute), r5 (memory), g4dn (GPU)
- **Storage**: EBS (persistent block storage), Instance Store (ephemeral, fast), EFS (shared file system)
- **Auto Scaling Groups**: automatically add/remove instances based on load

### S3 — Object Storage

S3 stores any amount of data — files, images, backups, ML datasets.

```python
import boto3

s3 = boto3.client("s3")

# Upload a file:
s3.upload_file("local-file.txt", "my-bucket", "path/in/bucket/file.txt")

# Download a file:
s3.download_file("my-bucket", "path/file.txt", "local-copy.txt")

# Generate a presigned URL (allow temporary access without credentials):
url = s3.generate_presigned_url(
    "get_object",
    Params={"Bucket": "my-bucket", "Key": "path/file.txt"},
    ExpiresIn=3600   # 1 hour
)

# List objects:
response = s3.list_objects_v2(Bucket="my-bucket", Prefix="path/")
for obj in response.get("Contents", []):
    print(obj["Key"], obj["Size"])
```

### Lambda — Serverless Functions

Lambda runs code in response to events without managing servers.

```python
# Lambda function handler:
import json
import boto3

def handler(event, context):
    """
    event: the input data (from API Gateway, S3, etc.)
    context: runtime info (function name, timeout remaining, etc.)
    """
    user_id = event.get("pathParameters", {}).get("id")

    # Query DynamoDB:
    dynamodb = boto3.resource("dynamodb")
    table    = dynamodb.Table("Users")
    response = table.get_item(Key={"id": user_id})

    if "Item" not in response:
        return {
            "statusCode": 404,
            "body": json.dumps({"error": "User not found"})
        }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(response["Item"])
    }
```

### RDS — Managed Relational Databases

RDS manages PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server. AWS handles backups, patching, failover, and replication.

```bash
# Key RDS features to understand:
# - Multi-AZ: synchronous standby replica for automatic failover
# - Read Replicas: asynchronous copies for read scaling
# - Parameter Groups: tune database settings (shared_buffers, etc.)
# - Subnet Groups: VPC isolation for security
# - Encryption: at rest (KMS) and in transit (TLS)
```

```python
# Connect to RDS from application:
import psycopg2
import os

conn = psycopg2.connect(
    host=os.environ["RDS_HOST"],
    port=5432,
    dbname=os.environ["RDS_DATABASE"],
    user=os.environ["RDS_USERNAME"],
    password=os.environ["RDS_PASSWORD"],
    sslmode="require"   # Always use TLS for RDS connections!
)
```

**AWS Well-Architected Framework (5 Pillars)**:
1. **Operational Excellence** — automate, iterate, learn from failures
2. **Security** — least privilege, encryption, monitoring
3. **Reliability** — fault tolerance, disaster recovery, auto-recovery
4. **Performance Efficiency** — right-size resources, use managed services
5. **Cost Optimization** — pay only for what you use, optimize continuously$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'cloud-engineer' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- CYBERSECURITY ENGINEER – Module 3: Penetration Testing
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Web Application Security: OWASP Top 10',
$$## Web Application Security: OWASP Top 10

The OWASP Top 10 is the definitive list of the most critical web application security risks. Every developer and security engineer must know these.

### A01: Broken Access Control (Most Common)

Users can act outside their intended permissions.

```python
# VULNERABLE — users can access any order by ID:
@app.get("/api/orders/{order_id}")
async def get_order(order_id: int, current_user: User = Depends(get_current_user)):
    order = db.get_order(order_id)   # No ownership check!
    return order

# SECURE — check that the order belongs to the requesting user:
@app.get("/api/orders/{order_id}")
async def get_order(order_id: int, current_user: User = Depends(get_current_user)):
    order = db.get_order(order_id)
    if not order:
        raise HTTPException(status_code=404)
    if order.user_id != current_user.id:    # Ownership check!
        raise HTTPException(status_code=403, detail="Forbidden")
    return order
```

### A02: Cryptographic Failures

Exposing sensitive data due to weak or missing encryption.

```python
# VULNERABLE — MD5 for password hashing (easily cracked):
import hashlib
password_hash = hashlib.md5(password.encode()).hexdigest()

# SECURE — bcrypt with proper work factor:
import bcrypt

def hash_password(password: str) -> str:
    # cost factor 12 = ~300ms per hash, hard to brute-force
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())
```

### A03: Injection (SQL, NoSQL, Command)

```python
# VULNERABLE — SQL injection:
query = f"SELECT * FROM users WHERE username = '{username}'"
# Attacker enters: username = "'; DROP TABLE users; --"

# SECURE — parameterized queries:
query = "SELECT * FROM users WHERE username = $1"
result = await db.fetchrow(query, username)   # Input safely escaped by driver

# VULNERABLE — command injection:
import os
os.system(f"convert {filename} output.jpg")
# Attacker enters: filename = "image.jpg; rm -rf /"

# SECURE — use subprocess with a list (no shell):
import subprocess
subprocess.run(["convert", filename, "output.jpg"], check=True)
```

### A05: Security Misconfiguration

```python
# Common misconfigurations to fix:

# 1. Hide framework version headers:
app.config["SERVER_NAME"] = ""
# Add to Nginx: server_tokens off;

# 2. Set security headers:
from fastapi.middleware.trustedhost import TrustedHostMiddleware

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["example.com", "*.example.com"]
)

# Required security headers (add via Nginx or middleware):
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# Content-Security-Policy: default-src 'self'
# Strict-Transport-Security: max-age=31536000; includeSubDomains
# Referrer-Policy: strict-origin-when-cross-origin
```

### A07: Identification and Authentication Failures

```python
# Secure authentication implementation:

# 1. Rate limiting on login:
from slowapi import Limiter
limiter = Limiter(key_func=get_remote_address)

@app.post("/auth/login")
@limiter.limit("5/minute")   # Max 5 attempts per minute per IP
async def login(credentials: LoginRequest, request: Request):
    user = await authenticate_user(credentials.email, credentials.password)
    if not user:
        # Use constant-time comparison and same error for wrong user/password:
        await asyncio.sleep(0.1)   # Prevent timing attacks
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return create_tokens(user)

# 2. JWT with short expiry and secure secrets:
import jwt
from datetime import datetime, timedelta

def create_access_token(user_id: str) -> str:
    payload = {
        "sub":  user_id,
        "iat":  datetime.utcnow(),
        "exp":  datetime.utcnow() + timedelta(minutes=15),  # Short expiry!
        "type": "access"
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
```

### A09: Security Logging and Monitoring Failures

```python
import logging
import json

# Log security events properly:
security_logger = logging.getLogger("security")

def log_auth_event(event_type: str, user_id: str, ip: str, success: bool):
    security_logger.info(json.dumps({
        "event":     event_type,
        "user_id":   user_id,
        "ip":        ip,
        "success":   success,
        "timestamp": datetime.utcnow().isoformat(),
    }))

# Log these events:
# - Login success/failure
# - Password change
# - Permission denied (403)
# - Rate limit exceeded
# - Account lockout
# - Suspicious patterns (many failed logins from same IP)

# NEVER log:
# - Passwords (even hashed)
# - Full credit card numbers
# - JWT tokens or session IDs
```$$,
  'reading', '45 min', 1, 45
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'cybersecurity-engineer' AND m.order_index = 3
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- GIT & GITHUB – Module 1: Git Fundamentals
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Git Fundamentals: How Git Works',
$$## Git Fundamentals: How Git Works

Git tracks changes to files over time. Before learning commands, understanding Git''s internal model makes everything click.

### The Three Areas

```
Working Directory   →  Staging Area  →  Repository (.git/)
  (your files)        (the index)       (commit history)
                  git add           git commit
```

- **Working Directory**: the actual files on disk
- **Staging Area (Index)**: files you''ve prepared for the next commit
- **Repository**: the history of all commits

### Your First Repository

```bash
# Initialize a new repo:
git init my-project
cd my-project

# Configure your identity (once per machine):
git config --global user.name  "Alice Smith"
git config --global user.email "alice@example.com"

# Check what Git sees:
git status

# Track a new file:
echo "# My Project" > README.md
git status        # README.md is "untracked"

# Stage the file:
git add README.md
git status        # README.md is "staged" (green)

# Commit with a message:
git commit -m "Initial commit: add README"
git status        # Working tree is clean
```

### The Commit Object

A commit stores:
- A snapshot of all tracked files (not a diff!)
- Author, committer, timestamp
- Commit message
- Parent commit SHA (except the first commit)

```bash
# View the full commit object:
git cat-file -p HEAD
# tree   abc123...
# parent def456...
# author Alice <alice@example.com> 1704067200 +0000
# committer Alice <alice@example.com> 1704067200 +0000
#
# Initial commit: add README

# View commit history:
git log
git log --oneline
git log --oneline --graph --all   # Visualize branches

# Show what changed in a commit:
git show HEAD
git show abc123   # Any commit SHA
```

### The .gitignore File

Tell Git which files to never track:

```gitignore
# Dependencies:
node_modules/
__pycache__/
*.pyc
vendor/

# Build outputs:
dist/
build/
*.o
*.exe

# Environment and secrets (CRITICAL — never commit these!):
.env
.env.local
.env.*.local
*.pem
*.key

# IDE files:
.vscode/
.idea/
*.swp

# OS files:
.DS_Store
Thumbs.db
```

### Undoing Changes

```bash
# Discard uncommitted changes to a file (DESTRUCTIVE — cannot undo!):
git restore README.md

# Unstage a file (keep changes in working directory):
git restore --staged README.md

# Amend the last commit (change message or add forgotten files):
git add forgot-this.txt
git commit --amend --no-edit    # Add file to last commit, keep message

# Create a new commit that reverses a previous one (SAFE — keeps history):
git revert abc123

# Hard reset to a previous commit (DESTRUCTIVE — removes commits!):
git reset --hard HEAD~3   # Go back 3 commits, DELETE changes
```

### Viewing Differences

```bash
# Changes in working directory (not staged):
git diff

# Changes staged for commit:
git diff --staged

# Difference between two commits:
git diff HEAD~3 HEAD

# Which files changed between two branches:
git diff main..feature --name-only
```$$,
  'reading', '30 min', 1, 30
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'git-github' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Branching and Merging',
$$## Branching and Merging

Branches let you develop features in isolation without affecting the main codebase. Merging brings those changes back together.

### Creating and Switching Branches

```bash
# List all branches:
git branch           # Local branches
git branch -r        # Remote branches
git branch -a        # All branches

# Create a new branch:
git branch feature/user-authentication

# Switch to a branch:
git checkout feature/user-authentication
# Modern syntax (Git 2.23+):
git switch feature/user-authentication

# Create AND switch in one command:
git checkout -b feature/shopping-cart
git switch -c  feature/shopping-cart   # Modern equivalent
```

### The Branching Workflow

```bash
# Start a new feature:
git switch main
git pull origin main              # Get latest changes
git switch -c feature/payment     # Create branch from latest main

# Work on the feature:
git add .
git commit -m "feat: add Stripe payment integration"
git add .
git commit -m "feat: add payment webhook handler"

# When ready, merge back:
git switch main
git merge feature/payment         # Merge into main

# Clean up:
git branch -d feature/payment     # Delete local branch
git push origin --delete feature/payment  # Delete remote branch
```

### Merge Strategies

```bash
# Fast-forward merge (simple — no merge commit created):
#   main:    A---B
#   feature:     B---C---D
# After merge:
#   main:    A---B---C---D

git merge feature/login   # Git detects fast-forward automatically

# Three-way merge (creates a merge commit):
#   main:    A---B---E
#   feature:     C---D
# After merge:
#   main:    A---B---E---M   (M is the merge commit with 2 parents)

# Force a merge commit even when fast-forward is possible:
git merge --no-ff feature/login -m "Merge feature/login into main"
```

### Resolving Merge Conflicts

```bash
git switch main
git merge feature/my-feature
# CONFLICT (content): Merge conflict in src/app.js

# Open the conflicted file — Git marks it like this:
# <<<<<<< HEAD
# const title = "Main Version";
# =======
# const title = "Feature Version";
# >>>>>>> feature/my-feature

# Edit the file to the correct final result:
# const title = "Correct Final Version";

# Mark as resolved:
git add src/app.js

# Complete the merge:
git commit

# View all files with conflicts:
git diff --name-only --diff-filter=U
```

### Rebase — Rewriting History for Clean Linear History

```bash
# Rebase your feature branch on top of the latest main:
git switch feature/payment
git rebase main
# This replays your commits on top of main — linear history!

# Interactive rebase — edit, squash, reorder commits:
git rebase -i HEAD~4   # Edit the last 4 commits

# In the editor — change 'pick' to:
# pick   abc1234 feat: add payment form       ← keep as-is
# squash def5678 fix: fix typo in payment      ← squash into previous
# squash ghi9012 wip: more payment work        ← squash into previous
# reword jkl3456 feat: add payment webhook     ← keep but change message

# GOLDEN RULE: Never rebase commits that have been pushed and shared!
# Rebase rewrites history — it creates new commits with new SHAs
```

### Stashing — Save Uncommitted Work Temporarily

```bash
# Stash current changes:
git stash push -m "WIP: payment form UI"

# List stashes:
git stash list
# stash@{0}: WIP: payment form UI
# stash@{1}: WIP: bug fix attempt

# Apply the most recent stash:
git stash pop              # Apply and remove from stash

# Apply without removing:
git stash apply stash@{1}  # Apply specific stash

# Discard a stash:
git stash drop stash@{0}
git stash clear            # Remove all stashes
```$$,
  'reading', '35 min', 2, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'git-github' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 2);

-- ============================================================
-- LINUX & TERMINAL – Module 1: Terminal Basics
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Linux Terminal: Navigation and File Operations',
$$## Linux Terminal: Navigation and File Operations

The command line is the most powerful tool in a developer''s toolkit. Once you learn to navigate fluently, your productivity multiplies.

### The Linux Filesystem

Everything in Linux is a file. The filesystem starts at `/` (root):

```
/
├── bin/      Essential user binaries (ls, cp, mv...)
├── etc/      Configuration files
├── home/     User home directories (/home/alice/)
├── usr/      User programs and data
│   ├── bin/  Non-essential binaries
│   └── lib/  Libraries
├── var/      Variable data (logs, databases, mail)
├── tmp/      Temporary files (cleared on reboot)
├── proc/     Virtual filesystem: running processes
└── dev/      Device files (disks, terminals)
```

### Navigation

```bash
# Where am I?
pwd           # Print Working Directory: /home/alice/projects

# List directory contents:
ls            # Basic list
ls -l         # Long format: permissions, size, date
ls -la        # Include hidden files (starting with .)
ls -lh        # Human-readable file sizes (KB, MB, GB)
ls -lt        # Sort by modification time (newest first)

# Change directory:
cd /var/log              # Absolute path (from root)
cd projects              # Relative path (from current dir)
cd ..                    # Up one level
cd ../..                 # Up two levels
cd ~                     # Home directory
cd -                     # Previous directory (toggle back/forth)

# Create and remove directories:
mkdir myproject                  # Create a directory
mkdir -p projects/api/src        # Create nested directories at once
rmdir empty-dir                  # Remove empty directory
rm -rf old-project               # Remove directory and all contents (CAREFUL!)
```

### File Operations

```bash
# Create files:
touch newfile.txt              # Create empty file / update timestamp
echo "Hello, World!" > file.txt  # Write text to file (overwrites)
echo "More text" >> file.txt     # Append text to file

# View file contents:
cat file.txt                   # Print entire file
less file.txt                  # Scroll through (q to quit)
head -n 20 file.txt            # First 20 lines
tail -n 20 file.txt            # Last 20 lines
tail -f /var/log/nginx/access.log  # Follow live (great for logs!)

# Copy, move, rename:
cp file.txt backup.txt         # Copy file
cp -r src/ backup/             # Copy directory recursively
mv file.txt renamed.txt        # Move / rename
mv old-folder/ /new/location/  # Move directory

# Delete:
rm file.txt                    # Remove file (no recycle bin!)
rm *.log                       # Remove all .log files
rm -i *.txt                    # Interactive mode (confirm each)

# Search for files:
find . -name "*.js"            # Find by filename in current dir
find /var/log -name "*.log" -mtime -7  # .log files modified in last 7 days
find . -type d -name "node_modules"    # Find directories named node_modules
find . -size +100M             # Files larger than 100MB
```

### Permissions

```bash
# View permissions:
ls -la
# -rw-r--r--  1  alice  staff  1234  Jan 15  README.md
#  \_______/     \___/  \___/
#  permissions  owner   group
#
# Format: [type][owner rwx][group rwx][others rwx]
# - = file, d = directory, l = symlink

# Change permissions:
chmod 644 file.txt      # Numeric: owner=rw, group=r, others=r
chmod 755 script.sh     # Numeric: owner=rwx, group=rx, others=rx
chmod +x script.sh      # Add execute permission for everyone
chmod -w file.txt       # Remove write permission
chmod -R 755 directory/ # Recursive (all files inside)

# Change ownership:
chown alice:developers file.txt   # Set owner and group
sudo chown root:root /etc/config  # Often needs sudo

# Understanding numeric permissions:
# 4 = read (r)
# 2 = write (w)
# 1 = execute (x)
# Add them: 7 = rwx, 6 = rw-, 5 = r-x, 4 = r--
```

### Pipes and Redirection — The Shell Superpower

```bash
# Redirect output to a file:
ls -la > directory_listing.txt     # Overwrite
ls -la >> directory_listing.txt    # Append

# Redirect errors:
command 2> errors.log              # Stderr to file
command > output.log 2>&1          # Both stdout and stderr to file
command > /dev/null 2>&1           # Silence everything

# Pipe: connect stdout of one command to stdin of another
cat /var/log/nginx/access.log | grep "404" | wc -l
# Count 404 errors

ps aux | grep nginx | grep -v grep
# Find nginx processes

ls -la | sort -k5 -rn | head -10
# 10 largest files
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'linux-terminal' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- SOFTWARE ARCHITECTURE – Module 1: SOLID Principles
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'SOLID Principles with Real Code Examples',
$$## SOLID Principles with Real Code Examples

SOLID is a set of five principles that make software easier to understand, extend, and maintain. They are not rules — they are guidelines to apply with judgment.

### S — Single Responsibility Principle

> A class should have only one reason to change.

```typescript
// VIOLATION — this class has 3 responsibilities:
class User {
    async save()     { /* database logic */ }
    validate()       { /* validation logic */ }
    sendWelcomeEmail() { /* email logic */ }
}

// BETTER — separate responsibilities:
class UserRepository {
    async save(user: User)   { /* only database */ }
    async findById(id: string) { /* only database */ }
}

class UserValidator {
    validate(user: CreateUserDto): ValidationError[] {
        const errors: ValidationError[] = [];
        if (!user.email.includes("@")) errors.push({ field: "email", message: "Invalid" });
        if (user.password.length < 8)  errors.push({ field: "password", message: "Too short" });
        return errors;
    }
}

class EmailService {
    async sendWelcome(user: User) { /* only email */ }
}
```

### O — Open/Closed Principle

> Open for extension, closed for modification.

```typescript
// VIOLATION — must modify existing code to add new payment method:
class PaymentProcessor {
    process(amount: number, method: "stripe" | "paypal" | "apple_pay") {
        if      (method === "stripe")    { /* stripe code */ }
        else if (method === "paypal")    { /* paypal code */ }
        else if (method === "apple_pay") { /* add new if every time! */ }
    }
}

// BETTER — extend by adding new classes, never modifying PaymentProcessor:
interface PaymentProvider {
    charge(amount: number, currency: string): Promise<PaymentResult>;
}

class StripeProvider implements PaymentProvider {
    async charge(amount, currency) { /* stripe */ }
}

class PayPalProvider implements PaymentProvider {
    async charge(amount, currency) { /* paypal */ }
}

class ApplePayProvider implements PaymentProvider {    // Add new — no changes elsewhere!
    async charge(amount, currency) { /* apple pay */ }
}

class PaymentProcessor {
    constructor(private provider: PaymentProvider) {}
    async process(amount: number) {
        return this.provider.charge(amount, "USD");
    }
}
```

### L — Liskov Substitution Principle

> If S is a subtype of T, then objects of type T may be replaced by objects of type S without breaking the program.

```typescript
class Rectangle {
    constructor(protected width: number, protected height: number) {}
    setWidth(w: number)  { this.width = w; }
    setHeight(h: number) { this.height = h; }
    area() { return this.width * this.height; }
}

// VIOLATION — Square overrides setters in a way that breaks Rectangle''s contract:
class Square extends Rectangle {
    setWidth(s: number)  { this.width = this.height = s; }  // Violates LSP!
    setHeight(s: number) { this.width = this.height = s; }
}

// This code breaks when given a Square:
function doubleWidth(rect: Rectangle) {
    rect.setWidth(rect.getWidth() * 2);
    // Expected: area doubles. For Square: BOTH dimensions doubled, area quadruples!
}

// BETTER — don''t extend when LSP would be violated. Use composition:
class Shape { abstract area(): number; }
class RectangleShape extends Shape { ... }
class SquareShape extends Shape { ... }
```

### I — Interface Segregation Principle

> Clients should not be forced to depend on interfaces they do not use.

```typescript
// VIOLATION — fat interface forces classes to implement unused methods:
interface Worker {
    work():       void;
    eat():        void;
    sleep():      void;
}

class Robot implements Worker {
    work()  { console.log("working"); }
    eat()   { /* Robots don''t eat! */ throw new Error("Not implemented"); }
    sleep() { /* Robots don''t sleep! */ throw new Error("Not implemented"); }
}

// BETTER — split into focused interfaces:
interface Workable { work(): void; }
interface Feedable { eat(): void;  }
interface Restable { sleep(): void; }

class Human implements Workable, Feedable, Restable {
    work()  { /* ... */ }
    eat()   { /* ... */ }
    sleep() { /* ... */ }
}

class Robot implements Workable {
    work() { /* ... */ }
    // No need to implement eat or sleep!
}
```

### D — Dependency Inversion Principle

> Depend on abstractions, not concretions.

```typescript
// VIOLATION — high-level module directly depends on low-level implementation:
class OrderService {
    private db = new MySQLDatabase();   // Tightly coupled to MySQL!
    private logger = new ConsoleLogger();

    async createOrder(data: CreateOrderDto) {
        await this.db.save(data);
        this.logger.log("Order created");
    }
}

// BETTER — depend on abstractions (interfaces):
interface Database { save<T>(data: T): Promise<void>; }
interface Logger   { log(message: string): void; }

class OrderService {
    // Inject dependencies (can swap implementations without changing this class):
    constructor(private db: Database, private logger: Logger) {}

    async createOrder(data: CreateOrderDto) {
        await this.db.save(data);
        this.logger.log("Order created");
    }
}

// Now you can inject any implementation:
const order = new OrderService(new PostgresDatabase(), new WinstonLogger());
const test  = new OrderService(new InMemoryDatabase(), new SilentLogger());
```$$,
  'reading', '45 min', 1, 45
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'software-architecture' AND m.order_index = 1
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- TESTING & QA – Module 2: Unit Testing
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Unit Testing with Vitest: Mocks, Spies, and Coverage',
$$## Unit Testing with Vitest: Mocks, Spies, and Coverage

Unit tests verify that individual functions and classes work correctly in isolation. They are the fastest tests and should make up most of your test suite.

### Setup

```bash
npm install -D vitest @vitest/coverage-v8

# vitest.config.ts:
export default {
    test: {
        environment: "node",
        coverage: {
            provider:    "v8",
            reporter:    ["text", "lcov"],
            thresholds: { lines: 80, branches: 80 }
        }
    }
}
```

### Your First Tests

```typescript
// src/math.ts:
export function add(a: number, b: number): number { return a + b; }
export function divide(a: number, b: number): number {
    if (b === 0) throw new Error("Division by zero");
    return a / b;
}

// src/math.test.ts:
import { describe, it, expect } from "vitest";
import { add, divide } from "./math";

describe("add", () => {
    it("adds two positive numbers", () => {
        expect(add(2, 3)).toBe(5);
    });

    it("handles negative numbers", () => {
        expect(add(-1, -2)).toBe(-3);
    });

    it("returns a number", () => {
        expect(typeof add(1, 2)).toBe("number");
    });
});

describe("divide", () => {
    it("divides two numbers", () => {
        expect(divide(10, 2)).toBe(5);
        expect(divide(7, 2)).toBeCloseTo(3.5);   // For floating point
    });

    it("throws on division by zero", () => {
        expect(() => divide(5, 0)).toThrow("Division by zero");
        expect(() => divide(5, 0)).toThrow(Error);
    });
});
```

### Mocking Dependencies

```typescript
// src/userService.ts:
export class UserService {
    constructor(private emailService: EmailService, private userRepo: UserRepository) {}

    async createUser(data: CreateUserDto): Promise<User> {
        const user = await this.userRepo.save(data);
        await this.emailService.sendWelcome(user.email);
        return user;
    }
}

// src/userService.test.ts:
import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserService } from "./userService";

describe("UserService.createUser", () => {
    let emailService: EmailService;
    let userRepo: UserRepository;
    let userService: UserService;

    beforeEach(() => {
        // Create mocks before each test:
        emailService = {
            sendWelcome: vi.fn().mockResolvedValue(undefined),
        } as unknown as EmailService;

        userRepo = {
            save: vi.fn().mockResolvedValue({
                id:    "user-123",
                email: "alice@example.com",
                name:  "Alice",
            }),
        } as unknown as UserRepository;

        userService = new UserService(emailService, userRepo);
    });

    it("saves the user and sends a welcome email", async () => {
        const result = await userService.createUser({
            name:  "Alice",
            email: "alice@example.com",
        });

        // Assert return value:
        expect(result.id).toBe("user-123");

        // Assert interactions:
        expect(userRepo.save).toHaveBeenCalledOnce();
        expect(userRepo.save).toHaveBeenCalledWith({ name: "Alice", email: "alice@example.com" });
        expect(emailService.sendWelcome).toHaveBeenCalledWith("alice@example.com");
    });

    it("does not send email if user save fails", async () => {
        userRepo.save = vi.fn().mockRejectedValue(new Error("DB error"));

        await expect(userService.createUser({ name: "A", email: "a@b.com" }))
            .rejects.toThrow("DB error");

        expect(emailService.sendWelcome).not.toHaveBeenCalled();
    });
});
```

### Spies

```typescript
import { vi, it, expect } from "vitest";

it("calls the callback with correct arguments", () => {
    const callback = vi.fn();

    [1, 2, 3].forEach(callback);

    expect(callback).toHaveBeenCalledTimes(3);
    expect(callback).toHaveBeenNthCalledWith(1, 1, 0, [1, 2, 3]);
    expect(callback).toHaveBeenLastCalledWith(3, 2, [1, 2, 3]);
});

// Spy on an existing method (without replacing it):
it("spies on console.log", () => {
    const consoleSpy = vi.spyOn(console, "log");

    doSomethingThatLogs();

    expect(consoleSpy).toHaveBeenCalledWith("expected log message");
    consoleSpy.mockRestore();   // Restore original after test
});
```

### Common Matchers

```typescript
// Equality:
expect(x).toBe(5);               // Strict equality (===)
expect(obj).toEqual({ a: 1 });   // Deep equality
expect(arr).toContain(3);        // Array contains value
expect(obj).toMatchObject({ id: 1 });  // Partial object match

// Type checks:
expect(fn).toThrow();
expect(fn).not.toThrow();
expect(val).toBeNull();
expect(val).toBeDefined();
expect(val).toBeTruthy();
expect(val).toBeFalsy();

// Numbers:
expect(3.14).toBeCloseTo(3.14159, 1);   // 1 decimal place
expect(n).toBeGreaterThan(5);
expect(n).toBeLessThanOrEqual(10);

// Arrays:
expect([1, 2, 3]).toHaveLength(3);
expect(arr).toEqual(expect.arrayContaining([1, 2]));   // Contains (any order)
```$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'testing-qa' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- DOCKER & KUBERNETES – Module 3: Kubernetes Fundamentals
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Kubernetes Core Concepts: Pods, Deployments, Services',
$$## Kubernetes Core Concepts: Pods, Deployments, Services

Kubernetes (K8s) orchestrates containerized applications at scale — automatically deploying, scaling, healing, and load-balancing your workloads.

### The Kubernetes Architecture

```
Control Plane                  Worker Nodes
┌─────────────────────┐        ┌────────────────────┐
│ API Server          │        │ kubelet            │
│ (kube-apiserver)    │  ←───→ │ kube-proxy         │
│ etcd (state store)  │        │ Container Runtime  │
│ Scheduler           │        │ Pods               │
│ Controller Manager  │        └────────────────────┘
└─────────────────────┘
```

### Pods — The Smallest Deployable Unit

A Pod wraps one or more containers that share a network and storage.

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-api
  labels:
    app: my-api
    version: "1.0"
spec:
  containers:
  - name: api
    image: myorg/api:1.0.0
    ports:
    - containerPort: 3000
    env:
    - name: NODE_ENV
      value: production
    - name: DATABASE_URL
      valueFrom:
        secretKeyRef:
          name: db-secret
          key: url
    resources:
      requests:
        cpu:    "100m"   # 0.1 CPU core
        memory: "128Mi"
      limits:
        cpu:    "500m"   # 0.5 CPU core
        memory: "512Mi"
    livenessProbe:
      httpGet:
        path: /health
        port: 3000
      initialDelaySeconds: 10
      periodSeconds:       30
    readinessProbe:
      httpGet:
        path: /ready
        port: 3000
      initialDelaySeconds: 5
      periodSeconds: 10
```

```bash
kubectl apply -f pod.yaml
kubectl get pods
kubectl describe pod my-api
kubectl logs my-api
kubectl exec -it my-api -- sh   # Open a shell inside the pod
kubectl delete pod my-api
```

### Deployments — Manage Pod Replicas Declaratively

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-api
spec:
  replicas: 3           # Run 3 identical pods
  selector:
    matchLabels:
      app: my-api       # Must match pod template labels
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0    # Zero downtime
      maxSurge:       1    # Can have 1 extra pod during rollout
  template:
    metadata:
      labels:
        app: my-api
    spec:
      containers:
      - name: api
        image: myorg/api:1.0.0
        # ... (same as pod spec above)
```

```bash
kubectl apply -f deployment.yaml

# Check rollout status:
kubectl rollout status deployment/my-api

# Update the image (triggers rolling update):
kubectl set image deployment/my-api api=myorg/api:1.1.0

# Roll back if something is wrong:
kubectl rollout undo deployment/my-api

# Scale manually:
kubectl scale deployment/my-api --replicas=5
```

### Services — Stable Network Access to Pods

Pods have ephemeral IPs. Services provide a stable endpoint.

```yaml
# ClusterIP — only accessible inside the cluster:
apiVersion: v1
kind: Service
metadata:
  name: my-api-service
spec:
  selector:
    app: my-api     # Route traffic to pods with this label
  ports:
  - port:       80     # Service port
    targetPort: 3000   # Container port
  type: ClusterIP

---
# LoadBalancer — external access (creates cloud load balancer):
apiVersion: v1
kind: Service
metadata:
  name: my-api-lb
spec:
  selector:
    app: my-api
  ports:
  - port:       80
    targetPort: 3000
  type: LoadBalancer
```

### ConfigMaps and Secrets

```yaml
# ConfigMap — non-sensitive configuration:
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  LOG_LEVEL:    "info"
  API_TIMEOUT:  "30"
  FEATURE_FLAG: "enabled"

---
# Secret — sensitive data (base64 encoded):
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:       # Kubernetes will base64-encode automatically
  url:      "postgres://user:password@db:5432/mydb"
  password: "super-secret-password"
```$$,
  'reading', '45 min', 1, 45
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'docker-kubernetes' AND m.order_index = 3
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- NETWORKING – Module 3: DNS & HTTP
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'HTTP Deep Dive: Methods, Headers, Status Codes, TLS',
$$## HTTP Deep Dive: Methods, Headers, Status Codes, TLS

HTTP is the protocol of the web. Understanding how it works at the message level makes you a better API designer, debugger, and security engineer.

### HTTP Request Structure

```
GET /api/users?page=1&limit=20 HTTP/1.1
Host:            api.example.com
Authorization:   Bearer eyJhbGc...
Content-Type:    application/json
Accept:          application/json
User-Agent:      Mozilla/5.0 ...
Connection:      keep-alive
```

Parts:
1. **Request line**: `METHOD path?query HTTP/version`
2. **Headers**: key-value pairs providing metadata
3. **Empty line**: separates headers from body
4. **Body**: (optional) the payload

### HTTP Response Structure

```
HTTP/1.1 200 OK
Content-Type:   application/json; charset=utf-8
Content-Length: 432
Cache-Control:  max-age=300
ETag:           "abc123"
X-Request-Id:   req-7f9b23

{"users": [...]}
```

### HTTP Methods and Their Semantics

| Method   | Purpose                    | Safe? | Idempotent? | Body?   |
|----------|----------------------------|-------|-------------|---------|
| GET      | Retrieve resource          | Yes   | Yes         | No      |
| HEAD     | Retrieve headers only      | Yes   | Yes         | No      |
| POST     | Create / submit data       | No    | No          | Yes     |
| PUT      | Replace entire resource    | No    | Yes         | Yes     |
| PATCH    | Partial update             | No    | No*         | Yes     |
| DELETE   | Remove resource            | No    | Yes         | Rarely  |
| OPTIONS  | Discover allowed methods   | Yes   | Yes         | No      |

**Safe**: doesn''t modify state.
**Idempotent**: calling multiple times has same effect as calling once.

### Status Code Reference

```
1xx — Informational
    100 Continue — client should continue request body
    101 Switching Protocols — upgrading to WebSocket

2xx — Success
    200 OK           — request succeeded
    201 Created      — resource created (POST/PUT)
    204 No Content   — success, no body (DELETE)
    206 Partial Content — range request (video streaming)

3xx — Redirection
    301 Moved Permanently — permanent redirect (update bookmarks, SEO)
    302 Found            — temporary redirect
    304 Not Modified     — cached version is still valid (ETag/If-None-Match)

4xx — Client Errors
    400 Bad Request     — malformed syntax, invalid input
    401 Unauthorized    — not authenticated (need to log in)
    403 Forbidden       — authenticated but not authorized
    404 Not Found       — resource does not exist
    409 Conflict        — state conflict (e.g., duplicate email)
    422 Unprocessable   — valid syntax but semantic errors (validation)
    429 Too Many Requests — rate limit exceeded

5xx — Server Errors
    500 Internal Server Error — unexpected server failure
    502 Bad Gateway           — upstream server returned invalid response
    503 Service Unavailable   — server overloaded or in maintenance
    504 Gateway Timeout       — upstream server too slow
```

### Important HTTP Headers

```bash
# Security headers (always include these):
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self'
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=()

# Caching headers:
Cache-Control: max-age=3600, must-revalidate   # Cache for 1 hour
ETag: "abc123def456"                           # Content fingerprint
Last-Modified: Mon, 15 Jan 2024 10:30:00 GMT
Vary: Accept-Encoding, Accept-Language         # Cache varies by these

# CORS (Cross-Origin Resource Sharing):
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400   # Preflight cache for 24 hours
```

### TLS Handshake (HTTPS)

```
Client                              Server
  |                                   |
  |  ── ClientHello ─────────────→    |  (TLS version, cipher suites, random)
  |  ←── ServerHello ──────────────   |  (chosen cipher, random)
  |  ←── Certificate ───────────────  |  (server''s public key + CA signature)
  |  ←── ServerHelloDone ───────────  |
  |                                   |
  |  [Client verifies certificate]    |
  |  [Client generates pre-master secret]
  |  ── ClientKeyExchange ───────→    |  (encrypted with server public key)
  |                                   |
  |  [Both derive session keys from the three randoms + pre-master secret]
  |                                   |
  |  ── ChangeCipherSpec ──────────→  |
  |  ── Finished ──────────────────→  |
  |  ←── ChangeCipherSpec ──────────  |
  |  ←── Finished ──────────────────  |
  |                                   |
  |  ═══ Encrypted Application Data ══|
```$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'networking' AND m.order_index = 3
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- DISTRIBUTED SYSTEMS – Module 2: Consistency & Consensus
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'CAP Theorem and Consistency Models',
$$## CAP Theorem and Consistency Models

Every distributed systems engineer must deeply understand the CAP theorem and the various consistency models. They determine what guarantees your system can and cannot make.

### CAP Theorem

CAP states that a distributed system can guarantee at most **2 of 3** properties simultaneously:

- **C — Consistency**: Every read receives the most recent write or an error
- **A — Availability**: Every request receives a (non-error) response — but without guarantee it contains the most recent write
- **P — Partition Tolerance**: The system continues operating despite network partitions (message loss/delay between nodes)

> **P is not optional.** Networks fail. You MUST tolerate partitions. So the real choice is: when a partition occurs, do you sacrifice C or A?

```
             CA               CP               AP
         ┌─────────┐      ┌─────────┐      ┌─────────┐
         │ Single- │      │MongoDB  │      │Cassandra│
         │ node DB │      │HBase    │      │DynamoDB │
         │ RDBMS   │      │ZooKeeper│      │CouchDB  │
         └─────────┘      └─────────┘      └─────────┘
     (not distributed!)   (prefer      (prefer
                          consistency)  availability)
```

### Consistency Models (From Strongest to Weakest)

**1. Linearizability (Strongest)**
Operations appear to execute atomically at a single point in time. Reads always return the latest write.

```
Timeline:  [Write x=1] ----> [Read x] must return 1, never old value
```

Used by: ZooKeeper, etcd, single-leader databases with synchronous replication.
Cost: High latency — must coordinate across all nodes before responding.

**2. Sequential Consistency**
All nodes see operations in the same order, but that order may not match real time. Allows some reordering as long as every client agrees on the order.

**3. Causal Consistency**
Operations that are causally related are seen in order. Concurrent operations can be in any order.

```python
# Causal relationship example:
# Alice posts "What time is it?" → Bob replies "It's 3pm"
# Every user who sees Bob's reply must also see Alice's question first.
# But unrelated posts can appear in any order.
```

**4. Eventual Consistency (Weakest)**
If no new updates are made, eventually all replicas will converge to the same value. Reads may return stale data until convergence.

```
Write to Node A:    x = 1
Read from Node B:   x = 0   (might be stale!)
Wait a bit...
Read from Node B:   x = 1   (eventually consistent)
```

Used by: DNS, S3, DynamoDB (default), Cassandra.

### PACELC — An Extension of CAP

PACELC adds latency to the picture:
- If Partition: choose between Availability and Consistency (PA/PC)
- Else (normal operation): choose between Latency and Consistency (EL/EC)

```
Database        PA/PC   EL/EC
DynamoDB        PA      EL    (high availability, low latency)
Cassandra       PA      EL
HBase           PC      EC    (strong consistency, higher latency)
MySQL (sync)    PC      EC
```

### Consistency in Practice: Read and Write Concerns

```javascript
// MongoDB — configurable consistency per operation:

// Strong read (read from primary only):
db.collection.findOne({ _id }, { readPreference: "primary" });

// Fast read (may be stale):
db.collection.findOne({ _id }, { readPreference: "secondaryPreferred" });

// Write with acknowledgment from majority of replicas:
db.collection.insertOne(doc, { writeConcern: { w: "majority" } });

// Cassandra consistency levels:
// SELECT * FROM users WHERE id = ? WITH CONSISTENCY QUORUM
// INSERT INTO users ... WITH CONSISTENCY ALL
// Quorum = majority of replicas. ALL = every replica. ONE = fastest (stale risk)
```

### Isolation Levels in SQL Databases

SQL databases have their own consistency spectrum for transactions:

| Level              | Dirty Read | Non-repeatable Read | Phantom Read |
|--------------------|-----------|---------------------|--------------|
| Read Uncommitted   | Possible  | Possible            | Possible     |
| Read Committed     | No        | Possible            | Possible     |
| Repeatable Read    | No        | No                  | Possible     |
| Serializable       | No        | No                  | No           |

PostgreSQL default: **Read Committed** (good balance of performance and correctness)
Use **Serializable** when strict correctness is critical (financial transactions).$$,
  'reading', '40 min', 1, 40
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'distributed-systems' AND m.order_index = 2
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- PERFORMANCE OPTIMIZATION – Module 4: Database Performance
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Database Performance: Indexes and Query Optimization',
$$## Database Performance: Indexes and Query Optimization

Database queries are often the biggest performance bottleneck in web applications. This lesson shows you how to diagnose and fix slow queries.

### Understanding EXPLAIN ANALYZE

```sql
-- Always start by understanding what the query planner is doing:
EXPLAIN ANALYZE
SELECT u.name, COUNT(o.id) AS order_count
FROM users u
JOIN orders o ON o.user_id = u.id
WHERE o.created_at > NOW() - INTERVAL '30 days'
  AND o.status = 'completed'
GROUP BY u.id, u.name
ORDER BY order_count DESC
LIMIT 10;
```

Understanding the output:
```
Sort  (cost=1234.56..1234.78 rows=10 width=24) (actual time=823.4..823.5 rows=10)
  ->  Limit  (actual time=823.2..823.2 rows=10)
       ->  HashAggregate  (actual time=821.1..821.3 rows=50)
            ->  Hash Join  (actual time=45.6..815.2 rows=4321)
                 Hash Cond: (o.user_id = u.id)
                 ->  Seq Scan on orders o  (cost=0..8234 rows=48212)   ← BAD!
                      Filter: (status = ''completed'' AND created_at > ...)
                      Rows Removed by Filter: 127831
```

`Seq Scan on orders` — reading the entire table! We need indexes.

### Creating the Right Indexes

```sql
-- Single-column index (when you filter by just one column):
CREATE INDEX CONCURRENTLY idx_orders_status
    ON orders (status);

-- Composite index (when you filter by multiple columns):
-- Order matters! Put the most selective column first, then left-to-right matching.
CREATE INDEX CONCURRENTLY idx_orders_status_created
    ON orders (status, created_at DESC);

-- Partial index (only index rows matching a condition — smaller, faster):
CREATE INDEX CONCURRENTLY idx_orders_pending
    ON orders (created_at)
    WHERE status = ''pending'';
-- Only ~5% of rows are pending — much smaller than full index!

-- Index on expression:
CREATE INDEX CONCURRENTLY idx_users_email_lower
    ON users (LOWER(email));
-- Now this query uses the index:
-- SELECT * FROM users WHERE LOWER(email) = LOWER(''Alice@Example.COM'')

-- CONCURRENTLY — creates index without locking the table (use in production!)
-- Without CONCURRENTLY — table is locked for writes during index creation
```

### The N+1 Query Problem

The most common ORM performance bug:

```javascript
// BAD — N+1 queries: 1 to get posts, then 1 per post to get the author
const posts = await Post.findAll({ limit: 100 });
for (const post of posts) {
    const author = await User.findById(post.authorId);  // 100 extra queries!
    console.log(`${post.title} by ${author.name}`);
}

// GOOD — 1 query with a JOIN:
const posts = await Post.findAll({
    limit: 100,
    include: [{ model: User, as: "author" }],   // Sequelize eager loading
});

// Even better in raw SQL:
SELECT p.title, u.name
FROM posts p
JOIN users u ON u.id = p.author_id
LIMIT 100;
```

### Query Optimization Patterns

```sql
-- 1. Use covering indexes — index contains all columns the query needs:
--    No need to look up the actual table row
CREATE INDEX idx_orders_covering
    ON orders (user_id, status, created_at, total_amount);

SELECT user_id, SUM(total_amount)
FROM orders
WHERE user_id = 42 AND status = ''completed''
-- Uses index only (no heap access) — very fast!

-- 2. Avoid functions on indexed columns in WHERE:
-- BAD (can''t use index):
WHERE YEAR(created_at) = 2024

-- GOOD (uses index):
WHERE created_at >= ''2024-01-01'' AND created_at < ''2025-01-01''

-- 3. Avoid SELECT * — only fetch columns you need:
-- BAD:
SELECT * FROM users WHERE id = 42

-- GOOD:
SELECT id, name, email FROM users WHERE id = 42

-- 4. Use EXISTS instead of IN for subqueries:
-- BAD:
SELECT * FROM users WHERE id IN (SELECT user_id FROM orders WHERE total > 1000)

-- BETTER:
SELECT * FROM users u WHERE EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id AND o.total > 1000
)
```

### Connection Pooling

```javascript
// Without pooling — creating a new DB connection per request is slow (100-300ms!):
// app.get("/users", async (req, res) => {
//     const client = new pg.Client(config);
//     await client.connect();   // ~200ms!
//     ...
// });

// With pooling — connections are reused:
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    min:             2,    // Keep at least 2 connections open
    max:             20,   // Max 20 connections
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Query uses an existing connection from the pool (~1ms instead of 200ms):
const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
```$$,
  'reading', '45 min', 1, 45
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'performance-optimization' AND m.order_index = 4
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);

-- ============================================================
-- OPEN SOURCE – Module 3: Your First Contribution
-- ============================================================

INSERT INTO public.lessons (module_id, title, content, type, duration, order_index, estimated_minutes)
SELECT m.id,
  'Contributing to Open Source: Fork to Merged PR',
$$## Contributing to Open Source: Fork to Merged PR

Contributing to open source is one of the best ways to build real-world experience, expand your network, and give back. This lesson walks through the entire process.

### Finding the Right Project

```bash
# GitHub search filters for good first issues:
# label:"good first issue" language:TypeScript
# label:"help wanted" language:Python stars:>100

# Great resources:
# goodfirstissue.dev
# up-for-grabs.net
# codetriage.com
```

**What to look for:**
- Active repository (commits in the last 30 days)
- Responsive maintainers (issues get replies within a few days)
- Clear CONTRIBUTING.md
- Issues labeled "good first issue" or "beginner friendly"
- A welcoming community tone

### The Contribution Workflow

```bash
# Step 1: Fork the repository on GitHub (click "Fork" button)

# Step 2: Clone YOUR fork (not the original):
git clone https://github.com/YOUR-USERNAME/project-name.git
cd project-name

# Step 3: Add the original as "upstream":
git remote add upstream https://github.com/ORIGINAL-OWNER/project-name.git
git remote -v
# origin   https://github.com/YOUR-USERNAME/project-name.git (your fork)
# upstream https://github.com/ORIGINAL-OWNER/project-name.git (original)

# Step 4: Sync with upstream before starting work:
git fetch upstream
git checkout main
git merge upstream/main     # or: git rebase upstream/main

# Step 5: Create a branch for your fix:
git checkout -b fix/typo-in-readme
# or: git checkout -b feat/add-dark-mode
```

### Making Your Changes

```bash
# Read the issue carefully. Ask questions if unclear BEFORE coding.

# Make your changes, following the project''s coding style:
# - Match indentation (2 spaces vs 4 spaces, tabs vs spaces)
# - Follow naming conventions (camelCase vs snake_case)
# - Run linter: npm run lint / flake8 . / etc.

# Commit with a conventional commit message:
git add src/utils/helper.ts
git commit -m "fix: correct typo in validateEmail function

Fixes #432

The function was named validateEmial (transposition). Renamed to
validateEmail throughout the module."

# Push to YOUR fork:
git push origin fix/typo-in-readme
```

### Opening a Pull Request

A good PR description:
```markdown
## Summary
Fixed a typo in the `validateEmail` function name (`validateEmial` → `validateEmail`).
Renamed all references in `src/utils/helper.ts` and updated the corresponding tests.

## Changes
- Renamed `validateEmial` to `validateEmail` in `helper.ts`
- Updated `helper.test.ts` to use the correct name
- No behavioral changes

## Related Issues
Closes #432

## Checklist
- [x] Tests pass (`npm test`)
- [x] Linter passes (`npm run lint`)
- [x] No breaking changes
```

### Responding to Review Feedback

```bash
# Maintainer: "Can you add a test for the edge case where email is empty?"

# Make the change:
# (edit the test file)
git add tests/helper.test.ts
git commit -m "test: add edge case for empty email in validateEmail"

# Push to the same branch — PR updates automatically:
git push origin fix/typo-in-readme

# Respond to the review comment:
# "Added test for empty string edge case in the latest commit (abc1234). 
#  It now throws ValidationError as expected."
```

### Keeping Your Fork Synced

```bash
# The original repo gets new commits while your PR is open.
# Sync and rebase to avoid conflicts:

git fetch upstream
git checkout fix/typo-in-readme
git rebase upstream/main

# If there are conflicts, resolve them, then:
git add resolved-file.ts
git rebase --continue

# Force push (required after rebase — only to YOUR branch):
git push --force-with-lease origin fix/typo-in-readme
# --force-with-lease is safer than --force: aborts if someone else pushed
```$$,
  'reading', '35 min', 1, 35
FROM public.modules m
JOIN public.learning_paths lp ON lp.id = m.path_id
WHERE lp.slug = 'open-source' AND m.order_index = 3
AND NOT EXISTS (SELECT 1 FROM public.lessons l WHERE l.module_id = m.id AND l.order_index = 1);
