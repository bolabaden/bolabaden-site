import { TechStack } from "@/lib/types";

export type SkillCategory = TechStack["category"];

export interface CategoryScoreBreakdown {
  category: SkillCategory;
  score: number;
  reasons: string[];
}

export interface CategoryInferenceResult {
  category: SkillCategory;
  confidence: number;
  normalizedLanguage: string;
  breakdown: CategoryScoreBreakdown[];
}

export interface LanguageCategoryProfile {
  name: string;
  aliases: string[];
  categoryWeights: Partial<Record<SkillCategory, number>>;
  ecosystems: string[];
  paradigms: string[];
  tags: string[];
}

export interface TaxonomyProfileSnapshot {
  name: string;
  aliases: string[];
  ecosystems: string[];
  tags: string[];
}

interface WeightedKeyword {
  token: string;
  category: SkillCategory;
  weight: number;
  reason: string;
}

interface RegexRule {
  pattern: RegExp;
  category: SkillCategory;
  weight: number;
  reason: string;
}

const CATEGORIES: SkillCategory[] = [
  "frontend",
  "backend",
  "infrastructure",
  "database",
  "ai-ml",
  "devops",
];

function normalizeToken(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[_./]+/g, "-")
    .replace(/[^a-z0-9#+-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function splitTokens(input: string): string[] {
  const base = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^a-zA-Z0-9#+.]+/g)
    .map((token) => normalizeToken(token))
    .filter(Boolean);

  const expanded: string[] = [];
  for (const token of base) {
    expanded.push(token);
    if (token.includes("-")) {
      for (const part of token.split("-")) {
        if (part.length >= 2) expanded.push(part);
      }
    }
  }

  return Array.from(new Set(expanded));
}

const LANGUAGE_PROFILES: LanguageCategoryProfile[] = [
  {
    name: "TypeScript",
    aliases: ["typescript", "ts", "tsx", "tsc"],
    categoryWeights: { frontend: 0.86, backend: 0.68, devops: 0.26 },
    ecosystems: ["node", "deno", "bun", "nextjs", "nestjs", "angular", "react"],
    paradigms: ["typed-javascript", "oop", "fp"],
    tags: ["web", "fullstack", "runtime"],
  },
  {
    name: "JavaScript",
    aliases: ["javascript", "js", "jsx", "nodejs", "node"],
    categoryWeights: { frontend: 0.84, backend: 0.66, devops: 0.24 },
    ecosystems: ["node", "express", "koa", "react", "vue", "svelte"],
    paradigms: ["scripting", "oop", "fp"],
    tags: ["web", "runtime"],
  },
  {
    name: "HTML",
    aliases: ["html", "xhtml"],
    categoryWeights: { frontend: 0.98 },
    ecosystems: ["web", "dom"],
    paradigms: ["markup"],
    tags: ["ui", "document"],
  },
  {
    name: "CSS",
    aliases: ["css", "postcss"],
    categoryWeights: { frontend: 0.98 },
    ecosystems: ["tailwind", "bootstrap", "postcss"],
    paradigms: ["styling"],
    tags: ["ui", "layout"],
  },
  {
    name: "Sass",
    aliases: ["sass"],
    categoryWeights: { frontend: 0.95 },
    ecosystems: ["scss", "webpack", "vite"],
    paradigms: ["preprocessor"],
    tags: ["styles"],
  },
  {
    name: "SCSS",
    aliases: ["scss"],
    categoryWeights: { frontend: 0.95 },
    ecosystems: ["sass", "vite", "webpack"],
    paradigms: ["preprocessor"],
    tags: ["styles"],
  },
  {
    name: "Less",
    aliases: ["less"],
    categoryWeights: { frontend: 0.92 },
    ecosystems: ["webpack", "antd"],
    paradigms: ["preprocessor"],
    tags: ["styles"],
  },
  {
    name: "Stylus",
    aliases: ["stylus"],
    categoryWeights: { frontend: 0.9 },
    ecosystems: ["webpack", "vite"],
    paradigms: ["preprocessor"],
    tags: ["styles"],
  },
  {
    name: "Vue",
    aliases: ["vue", "vuejs", "nuxt", "nuxtjs"],
    categoryWeights: { frontend: 0.94 },
    ecosystems: ["vuex", "pinia", "vite"],
    paradigms: ["component"],
    tags: ["web-ui"],
  },
  {
    name: "Svelte",
    aliases: ["svelte", "sveltekit"],
    categoryWeights: { frontend: 0.92 },
    ecosystems: ["vite", "kit"],
    paradigms: ["component"],
    tags: ["web-ui"],
  },
  {
    name: "Astro",
    aliases: ["astro"],
    categoryWeights: { frontend: 0.9 },
    ecosystems: ["vite", "islands"],
    paradigms: ["component", "ssg"],
    tags: ["web-ui"],
  },
  {
    name: "React",
    aliases: ["react", "reactjs"],
    categoryWeights: { frontend: 0.94 },
    ecosystems: ["nextjs", "vite", "redux"],
    paradigms: ["component", "declarative"],
    tags: ["web-ui"],
  },
  {
    name: "Solid",
    aliases: ["solid", "solidjs"],
    categoryWeights: { frontend: 0.9 },
    ecosystems: ["vite"],
    paradigms: ["component", "reactive"],
    tags: ["web-ui"],
  },
  {
    name: "Angular",
    aliases: ["angular", "angularjs"],
    categoryWeights: { frontend: 0.9 },
    ecosystems: ["rxjs", "cli"],
    paradigms: ["component", "mvc"],
    tags: ["web-ui"],
  },
  {
    name: "Elm",
    aliases: ["elm"],
    categoryWeights: { frontend: 0.88 },
    ecosystems: ["browser"],
    paradigms: ["functional"],
    tags: ["web-ui"],
  },
  {
    name: "Reason",
    aliases: ["reason", "reasonml"],
    categoryWeights: { frontend: 0.76, backend: 0.42 },
    ecosystems: ["rescript", "bucklescript"],
    paradigms: ["functional"],
    tags: ["typed"],
  },
  {
    name: "ReScript",
    aliases: ["rescript"],
    categoryWeights: { frontend: 0.82, backend: 0.44 },
    ecosystems: ["react"],
    paradigms: ["functional"],
    tags: ["typed"],
  },
  {
    name: "Python",
    aliases: ["python", "py", "cpython", "pypy"],
    categoryWeights: { backend: 0.84, "ai-ml": 0.86, devops: 0.3 },
    ecosystems: ["django", "flask", "fastapi", "pytorch", "tensorflow"],
    paradigms: ["scripting", "oop", "scientific"],
    tags: ["data", "automation"],
  },
  {
    name: "Go",
    aliases: ["go", "golang"],
    categoryWeights: { backend: 0.9, infrastructure: 0.52, devops: 0.42 },
    ecosystems: ["gin", "fiber", "grpc", "kubernetes"],
    paradigms: ["compiled", "concurrency"],
    tags: ["systems", "services"],
  },
  {
    name: "Rust",
    aliases: ["rust"],
    categoryWeights: { backend: 0.86, infrastructure: 0.58, devops: 0.34 },
    ecosystems: ["tokio", "axum", "actix", "wasm"],
    paradigms: ["systems", "memory-safe"],
    tags: ["high-performance"],
  },
  {
    name: "Java",
    aliases: ["java", "jdk"],
    categoryWeights: { backend: 0.9 },
    ecosystems: ["spring", "quarkus", "maven", "gradle"],
    paradigms: ["oop", "jvm"],
    tags: ["enterprise"],
  },
  {
    name: "Kotlin",
    aliases: ["kotlin", "kt"],
    categoryWeights: { backend: 0.8, frontend: 0.22 },
    ecosystems: ["ktor", "spring", "android"],
    paradigms: ["jvm", "functional"],
    tags: ["mobile", "backend"],
  },
  {
    name: "Swift",
    aliases: ["swift"],
    categoryWeights: { backend: 0.46, frontend: 0.52 },
    ecosystems: ["ios", "swiftui", "vapor"],
    paradigms: ["mobile", "compiled"],
    tags: ["apple"],
  },
  {
    name: "C",
    aliases: ["c", "gnu-c"],
    categoryWeights: { backend: 0.74, infrastructure: 0.54 },
    ecosystems: ["gcc", "clang", "cmake"],
    paradigms: ["systems"],
    tags: ["native"],
  },
  {
    name: "C++",
    aliases: ["c++", "cpp", "cxx"],
    categoryWeights: { backend: 0.78, infrastructure: 0.5 },
    ecosystems: ["cmake", "qt", "boost"],
    paradigms: ["systems", "oop"],
    tags: ["native"],
  },
  {
    name: "C#",
    aliases: ["c#", "csharp", "dotnet", "aspnet"],
    categoryWeights: { backend: 0.86, frontend: 0.2 },
    ecosystems: ["aspnet", "blazor", "entityframework"],
    paradigms: ["oop", "jitted"],
    tags: ["enterprise"],
  },
  {
    name: "Ruby",
    aliases: ["ruby", "rb"],
    categoryWeights: { backend: 0.8 },
    ecosystems: ["rails", "sinatra", "sidekiq"],
    paradigms: ["scripting", "oop"],
    tags: ["web"],
  },
  {
    name: "PHP",
    aliases: ["php"],
    categoryWeights: { backend: 0.82 },
    ecosystems: ["laravel", "symfony", "wordpress"],
    paradigms: ["scripting"],
    tags: ["web"],
  },
  {
    name: "Scala",
    aliases: ["scala"],
    categoryWeights: { backend: 0.76, "ai-ml": 0.24 },
    ecosystems: ["akka", "play", "spark"],
    paradigms: ["functional", "jvm"],
    tags: ["data"],
  },
  {
    name: "Haskell",
    aliases: ["haskell", "hs"],
    categoryWeights: { backend: 0.68 },
    ecosystems: ["stack", "cabal"],
    paradigms: ["functional"],
    tags: ["compiler"],
  },
  {
    name: "Elixir",
    aliases: ["elixir", "ex"],
    categoryWeights: { backend: 0.8, infrastructure: 0.24 },
    ecosystems: ["phoenix", "beam"],
    paradigms: ["functional", "concurrency"],
    tags: ["realtime"],
  },
  {
    name: "Erlang",
    aliases: ["erlang", "erl"],
    categoryWeights: { backend: 0.76, infrastructure: 0.22 },
    ecosystems: ["otp", "beam"],
    paradigms: ["functional", "concurrency"],
    tags: ["reliability"],
  },
  {
    name: "Zig",
    aliases: ["zig"],
    categoryWeights: { backend: 0.66, infrastructure: 0.56 },
    ecosystems: ["llvm"],
    paradigms: ["systems"],
    tags: ["native"],
  },
  {
    name: "Lua",
    aliases: ["lua"],
    categoryWeights: { backend: 0.58, devops: 0.36 },
    ecosystems: ["openresty", "neovim"],
    paradigms: ["scripting"],
    tags: ["embedded"],
  },
  {
    name: "Dart",
    aliases: ["dart"],
    categoryWeights: { frontend: 0.72, backend: 0.42 },
    ecosystems: ["flutter", "dartfrog"],
    paradigms: ["mobile", "web"],
    tags: ["cross-platform"],
  },
  {
    name: "Perl",
    aliases: ["perl", "pl"],
    categoryWeights: { backend: 0.64, devops: 0.36 },
    ecosystems: ["cpan"],
    paradigms: ["scripting"],
    tags: ["automation"],
  },
  {
    name: "OCaml",
    aliases: ["ocaml", "ml"],
    categoryWeights: { backend: 0.62 },
    ecosystems: ["opam", "dune"],
    paradigms: ["functional"],
    tags: ["compiler"],
  },
  {
    name: "FSharp",
    aliases: ["fsharp", "f#"],
    categoryWeights: { backend: 0.7, "ai-ml": 0.2 },
    ecosystems: ["dotnet"],
    paradigms: ["functional", "jitted"],
    tags: ["enterprise"],
  },
  {
    name: "SQL",
    aliases: ["sql", "ansi-sql"],
    categoryWeights: { database: 0.98 },
    ecosystems: ["dbt", "warehouse", "etl"],
    paradigms: ["query"],
    tags: ["data"],
  },
  {
    name: "PostgreSQL",
    aliases: ["postgres", "postgresql", "psql"],
    categoryWeights: { database: 0.96 },
    ecosystems: ["postgis", "timescaledb"],
    paradigms: ["relational"],
    tags: ["data"],
  },
  {
    name: "MySQL",
    aliases: ["mysql", "mariadb"],
    categoryWeights: { database: 0.94 },
    ecosystems: ["innodb"],
    paradigms: ["relational"],
    tags: ["data"],
  },
  {
    name: "SQLite",
    aliases: ["sqlite"],
    categoryWeights: { database: 0.92 },
    ecosystems: ["mobile", "embedded"],
    paradigms: ["relational"],
    tags: ["embedded"],
  },
  {
    name: "MongoDB",
    aliases: ["mongodb", "mongo", "mongoose"],
    categoryWeights: { database: 0.94 },
    ecosystems: ["atlas"],
    paradigms: ["document"],
    tags: ["nosql"],
  },
  {
    name: "Redis",
    aliases: ["redis"],
    categoryWeights: { database: 0.88, devops: 0.24 },
    ecosystems: ["cache", "queue"],
    paradigms: ["key-value"],
    tags: ["nosql"],
  },
  {
    name: "ClickHouse",
    aliases: ["clickhouse"],
    categoryWeights: { database: 0.9, "ai-ml": 0.14 },
    ecosystems: ["columnar", "analytics"],
    paradigms: ["olap"],
    tags: ["warehouse"],
  },
  {
    name: "Cassandra",
    aliases: ["cassandra"],
    categoryWeights: { database: 0.9 },
    ecosystems: ["nosql"],
    paradigms: ["wide-column"],
    tags: ["distributed"],
  },
  {
    name: "DynamoDB",
    aliases: ["dynamodb"],
    categoryWeights: { database: 0.86, infrastructure: 0.18 },
    ecosystems: ["aws"],
    paradigms: ["key-value", "document"],
    tags: ["managed"],
  },
  {
    name: "MariaDB",
    aliases: ["mariadb"],
    categoryWeights: { database: 0.9 },
    ecosystems: ["mysql"],
    paradigms: ["relational"],
    tags: ["data"],
  },
  {
    name: "Dockerfile",
    aliases: ["docker", "dockerfile", "container"],
    categoryWeights: { devops: 0.92, infrastructure: 0.3 },
    ecosystems: ["docker", "compose", "containerd"],
    paradigms: ["packaging"],
    tags: ["containers"],
  },
  {
    name: "Shell",
    aliases: ["shell", "sh", "zsh"],
    categoryWeights: { devops: 0.86, infrastructure: 0.26 },
    ecosystems: ["linux", "unix"],
    paradigms: ["scripting"],
    tags: ["automation"],
  },
  {
    name: "Bash",
    aliases: ["bash"],
    categoryWeights: { devops: 0.9, infrastructure: 0.24 },
    ecosystems: ["linux", "ci"],
    paradigms: ["scripting"],
    tags: ["automation"],
  },
  {
    name: "PowerShell",
    aliases: ["powershell", "pwsh", "ps1"],
    categoryWeights: { devops: 0.9, infrastructure: 0.24 },
    ecosystems: ["azure", "windows"],
    paradigms: ["scripting"],
    tags: ["automation"],
  },
  {
    name: "YAML",
    aliases: ["yaml", "yml"],
    categoryWeights: { devops: 0.88, infrastructure: 0.42 },
    ecosystems: ["github-actions", "kubernetes", "ansible"],
    paradigms: ["configuration"],
    tags: ["config"],
  },
  {
    name: "Nix",
    aliases: ["nix"],
    categoryWeights: { devops: 0.76, infrastructure: 0.44 },
    ecosystems: ["nixos", "flakes"],
    paradigms: ["reproducibility"],
    tags: ["configuration"],
  },
  {
    name: "Makefile",
    aliases: ["make", "makefile"],
    categoryWeights: { devops: 0.82 },
    ecosystems: ["build", "ci"],
    paradigms: ["build-system"],
    tags: ["automation"],
  },
  {
    name: "Groovy",
    aliases: ["groovy", "jenkinsfile"],
    categoryWeights: { devops: 0.72, backend: 0.4 },
    ecosystems: ["jenkins", "gradle"],
    paradigms: ["scripting"],
    tags: ["ci"],
  },
  {
    name: "HCL",
    aliases: ["hcl"],
    categoryWeights: { infrastructure: 0.9, devops: 0.32 },
    ecosystems: ["terraform", "nomad"],
    paradigms: ["configuration"],
    tags: ["iac"],
  },
  {
    name: "Terraform",
    aliases: ["terraform", "tf"],
    categoryWeights: { infrastructure: 0.96, devops: 0.34 },
    ecosystems: ["aws", "azure", "gcp"],
    paradigms: ["iac"],
    tags: ["cloud"],
  },
  {
    name: "Helm",
    aliases: ["helm"],
    categoryWeights: { infrastructure: 0.9, devops: 0.32 },
    ecosystems: ["kubernetes"],
    paradigms: ["packaging"],
    tags: ["k8s"],
  },
  {
    name: "Ansible",
    aliases: ["ansible", "playbook"],
    categoryWeights: { infrastructure: 0.86, devops: 0.42 },
    ecosystems: ["automation", "yaml"],
    paradigms: ["configuration-management"],
    tags: ["ops"],
  },
  {
    name: "Pulumi",
    aliases: ["pulumi"],
    categoryWeights: { infrastructure: 0.88, devops: 0.3 },
    ecosystems: ["cloud", "typescript", "python", "go"],
    paradigms: ["iac"],
    tags: ["ops"],
  },
  {
    name: "Bicep",
    aliases: ["bicep"],
    categoryWeights: { infrastructure: 0.86, devops: 0.26 },
    ecosystems: ["azure"],
    paradigms: ["iac"],
    tags: ["ops"],
  },
  {
    name: "Kubernetes",
    aliases: ["kubernetes", "k8s", "kubectl"],
    categoryWeights: { infrastructure: 0.95, devops: 0.42 },
    ecosystems: ["helm", "istio", "prometheus"],
    paradigms: ["orchestration"],
    tags: ["containers"],
  },
  {
    name: "Jupyter",
    aliases: ["jupyter", "ipynb", "notebook"],
    categoryWeights: { "ai-ml": 0.92, backend: 0.24 },
    ecosystems: ["python", "pandas"],
    paradigms: ["notebook"],
    tags: ["analysis"],
  },
  {
    name: "CUDA",
    aliases: ["cuda"],
    categoryWeights: { "ai-ml": 0.8, backend: 0.24 },
    ecosystems: ["gpu", "nvidia"],
    paradigms: ["parallel"],
    tags: ["acceleration"],
  },
  {
    name: "R",
    aliases: ["r", "rstudio"],
    categoryWeights: { "ai-ml": 0.76, database: 0.18 },
    ecosystems: ["tidyverse", "caret"],
    paradigms: ["statistics"],
    tags: ["analysis"],
  },
  {
    name: "MATLAB",
    aliases: ["matlab"],
    categoryWeights: { "ai-ml": 0.62, backend: 0.2 },
    ecosystems: ["simulink"],
    paradigms: ["numerical"],
    tags: ["analysis"],
  },
  {
    name: "GraphQL",
    aliases: ["graphql", "gql"],
    categoryWeights: { backend: 0.5, frontend: 0.48 },
    ecosystems: ["apollo", "urql"],
    paradigms: ["api"],
    tags: ["query"],
  },
  {
    name: "gRPC",
    aliases: ["grpc", "protobuf", "proto"],
    categoryWeights: { backend: 0.74, infrastructure: 0.24 },
    ecosystems: ["go", "java", "python"],
    paradigms: ["rpc"],
    tags: ["api"],
  },
  {
    name: "Protocol Buffers",
    aliases: ["protobuf", "proto3", "proto"],
    categoryWeights: { backend: 0.58, infrastructure: 0.28 },
    ecosystems: ["grpc"],
    paradigms: ["serialization"],
    tags: ["api"],
  },
  {
    name: "Apache Spark",
    aliases: ["spark", "pyspark"],
    categoryWeights: { "ai-ml": 0.5, backend: 0.46, database: 0.22 },
    ecosystems: ["scala", "python"],
    paradigms: ["distributed-processing"],
    tags: ["data"],
  },
  {
    name: "Apache Kafka",
    aliases: ["kafka"],
    categoryWeights: { backend: 0.56, infrastructure: 0.32, devops: 0.18 },
    ecosystems: ["streaming"],
    paradigms: ["event-stream"],
    tags: ["data"],
  },
  {
    name: "RabbitMQ",
    aliases: ["rabbitmq"],
    categoryWeights: { backend: 0.52, infrastructure: 0.3 },
    ecosystems: ["amqp"],
    paradigms: ["messaging"],
    tags: ["queue"],
  },
  {
    name: "Nginx",
    aliases: ["nginx"],
    categoryWeights: { devops: 0.54, infrastructure: 0.54 },
    ecosystems: ["reverse-proxy"],
    paradigms: ["network"],
    tags: ["gateway"],
  },
  {
    name: "Apache HTTP Server",
    aliases: ["apache-httpd", "httpd"],
    categoryWeights: { devops: 0.52, infrastructure: 0.42 },
    ecosystems: ["web-server"],
    paradigms: ["network"],
    tags: ["gateway"],
  },
  {
    name: "Istio",
    aliases: ["istio", "service-mesh"],
    categoryWeights: { infrastructure: 0.74, devops: 0.34 },
    ecosystems: ["kubernetes", "envoy"],
    paradigms: ["mesh"],
    tags: ["network"],
  },
  {
    name: "Envoy",
    aliases: ["envoy"],
    categoryWeights: { infrastructure: 0.62, devops: 0.3 },
    ecosystems: ["mesh", "gateway"],
    paradigms: ["proxy"],
    tags: ["network"],
  },
  {
    name: "Prometheus",
    aliases: ["prometheus"],
    categoryWeights: { devops: 0.64, infrastructure: 0.4 },
    ecosystems: ["grafana", "kubernetes"],
    paradigms: ["monitoring"],
    tags: ["observability"],
  },
  {
    name: "Grafana",
    aliases: ["grafana"],
    categoryWeights: { devops: 0.58, infrastructure: 0.34 },
    ecosystems: ["prometheus", "loki"],
    paradigms: ["observability"],
    tags: ["monitoring"],
  },
  {
    name: "OpenTelemetry",
    aliases: ["opentelemetry", "otel"],
    categoryWeights: { devops: 0.6, backend: 0.24 },
    ecosystems: ["tracing", "metrics"],
    paradigms: ["observability"],
    tags: ["telemetry"],
  },
  {
    name: "Bun",
    aliases: ["bun"],
    categoryWeights: { backend: 0.56, frontend: 0.44, devops: 0.18 },
    ecosystems: ["typescript", "javascript"],
    paradigms: ["runtime"],
    tags: ["web"],
  },
  {
    name: "Deno",
    aliases: ["deno"],
    categoryWeights: { backend: 0.58, frontend: 0.36, devops: 0.2 },
    ecosystems: ["typescript", "javascript"],
    paradigms: ["runtime"],
    tags: ["web"],
  },
  {
    name: "WebAssembly",
    aliases: ["wasm", "webassembly"],
    categoryWeights: { frontend: 0.42, backend: 0.42, infrastructure: 0.2 },
    ecosystems: ["rust", "go", "c++"],
    paradigms: ["binary"],
    tags: ["performance"],
  },
  {
    name: "Hugging Face",
    aliases: ["huggingface", "transformers"],
    categoryWeights: { "ai-ml": 0.76, backend: 0.22 },
    ecosystems: ["python", "pytorch"],
    paradigms: ["inference"],
    tags: ["llm"],
  },
  {
    name: "LangChain",
    aliases: ["langchain"],
    categoryWeights: { "ai-ml": 0.68, backend: 0.26 },
    ecosystems: ["python", "typescript"],
    paradigms: ["agentic"],
    tags: ["llm"],
  },
  {
    name: "LlamaIndex",
    aliases: ["llamaindex"],
    categoryWeights: { "ai-ml": 0.66, backend: 0.24 },
    ecosystems: ["python"],
    paradigms: ["rag"],
    tags: ["llm"],
  },
  {
    name: "TensorFlow",
    aliases: ["tensorflow", "tf"],
    categoryWeights: { "ai-ml": 0.84 },
    ecosystems: ["python", "keras"],
    paradigms: ["deep-learning"],
    tags: ["training"],
  },
  {
    name: "PyTorch",
    aliases: ["pytorch", "torch"],
    categoryWeights: { "ai-ml": 0.86 },
    ecosystems: ["python"],
    paradigms: ["deep-learning"],
    tags: ["training"],
  },
  {
    name: "ONNX",
    aliases: ["onnx"],
    categoryWeights: { "ai-ml": 0.62, backend: 0.2 },
    ecosystems: ["runtime"],
    paradigms: ["inference"],
    tags: ["model"],
  },
  {
    name: "Triton",
    aliases: ["triton", "triton-inference-server"],
    categoryWeights: { "ai-ml": 0.66, backend: 0.24 },
    ecosystems: ["nvidia", "cuda"],
    paradigms: ["inference"],
    tags: ["gpu"],
  },
  {
    name: "DuckDB",
    aliases: ["duckdb"],
    categoryWeights: { database: 0.76, "ai-ml": 0.2 },
    ecosystems: ["analytics"],
    paradigms: ["olap"],
    tags: ["embedded"],
  },
  {
    name: "Snowflake",
    aliases: ["snowflake"],
    categoryWeights: { database: 0.84, "ai-ml": 0.14 },
    ecosystems: ["warehouse"],
    paradigms: ["olap"],
    tags: ["managed"],
  },
  {
    name: "BigQuery",
    aliases: ["bigquery"],
    categoryWeights: { database: 0.84, infrastructure: 0.18 },
    ecosystems: ["gcp"],
    paradigms: ["olap"],
    tags: ["managed"],
  },
  {
    name: "Redshift",
    aliases: ["redshift"],
    categoryWeights: { database: 0.84, infrastructure: 0.16 },
    ecosystems: ["aws"],
    paradigms: ["olap"],
    tags: ["managed"],
  },
  {
    name: "dbt",
    aliases: ["dbt"],
    categoryWeights: { database: 0.62, "ai-ml": 0.16, backend: 0.16 },
    ecosystems: ["sql", "warehouse"],
    paradigms: ["transform"],
    tags: ["analytics"],
  },
  {
    name: "Airflow",
    aliases: ["airflow"],
    categoryWeights: { backend: 0.4, devops: 0.28, "ai-ml": 0.24 },
    ecosystems: ["python"],
    paradigms: ["orchestration"],
    tags: ["pipelines"],
  },
  {
    name: "Dagster",
    aliases: ["dagster"],
    categoryWeights: { backend: 0.36, "ai-ml": 0.26, devops: 0.2 },
    ecosystems: ["python"],
    paradigms: ["orchestration"],
    tags: ["pipelines"],
  },
  {
    name: "Prefect",
    aliases: ["prefect"],
    categoryWeights: { backend: 0.34, "ai-ml": 0.24, devops: 0.22 },
    ecosystems: ["python"],
    paradigms: ["orchestration"],
    tags: ["pipelines"],
  },
  {
    name: "Supabase",
    aliases: ["supabase"],
    categoryWeights: { database: 0.42, backend: 0.36, frontend: 0.24 },
    ecosystems: ["postgres", "typescript"],
    paradigms: ["baas"],
    tags: ["fullstack"],
  },
  {
    name: "Firebase",
    aliases: ["firebase", "firestore"],
    categoryWeights: { database: 0.44, backend: 0.3, frontend: 0.22 },
    ecosystems: ["gcp"],
    paradigms: ["baas"],
    tags: ["fullstack"],
  },
  {
    name: "Prisma",
    aliases: ["prisma"],
    categoryWeights: { database: 0.46, backend: 0.3 },
    ecosystems: ["typescript", "postgres", "mysql"],
    paradigms: ["orm"],
    tags: ["data-access"],
  },
  {
    name: "Drizzle",
    aliases: ["drizzle", "drizzle-orm"],
    categoryWeights: { database: 0.46, backend: 0.28 },
    ecosystems: ["typescript", "sql"],
    paradigms: ["orm"],
    tags: ["data-access"],
  },
  {
    name: "Sequelize",
    aliases: ["sequelize"],
    categoryWeights: { database: 0.42, backend: 0.3 },
    ecosystems: ["node", "sql"],
    paradigms: ["orm"],
    tags: ["data-access"],
  },
  {
    name: "TypeORM",
    aliases: ["typeorm"],
    categoryWeights: { database: 0.44, backend: 0.32 },
    ecosystems: ["typescript"],
    paradigms: ["orm"],
    tags: ["data-access"],
  },
  {
    name: "SQLAlchemy",
    aliases: ["sqlalchemy"],
    categoryWeights: { database: 0.46, backend: 0.3 },
    ecosystems: ["python"],
    paradigms: ["orm"],
    tags: ["data-access"],
  },
  {
    name: "Entity Framework",
    aliases: ["entityframework", "efcore", "ef"],
    categoryWeights: { database: 0.42, backend: 0.34 },
    ecosystems: ["dotnet"],
    paradigms: ["orm"],
    tags: ["data-access"],
  },
  {
    name: "Linux",
    aliases: ["linux"],
    categoryWeights: { devops: 0.54, infrastructure: 0.42 },
    ecosystems: ["kernel"],
    paradigms: ["os"],
    tags: ["systems"],
  },
  {
    name: "Windows",
    aliases: ["windows"],
    categoryWeights: { devops: 0.42, infrastructure: 0.34 },
    ecosystems: ["powershell"],
    paradigms: ["os"],
    tags: ["systems"],
  },
  {
    name: "AWS",
    aliases: ["aws"],
    categoryWeights: { infrastructure: 0.72, devops: 0.38 },
    ecosystems: ["cloud"],
    paradigms: ["managed-services"],
    tags: ["cloud"],
  },
  {
    name: "Azure",
    aliases: ["azure"],
    categoryWeights: { infrastructure: 0.72, devops: 0.38 },
    ecosystems: ["cloud"],
    paradigms: ["managed-services"],
    tags: ["cloud"],
  },
  {
    name: "GCP",
    aliases: ["gcp", "google-cloud"],
    categoryWeights: { infrastructure: 0.72, devops: 0.38 },
    ecosystems: ["cloud"],
    paradigms: ["managed-services"],
    tags: ["cloud"],
  },
  {
    name: "OpenAPI",
    aliases: ["openapi", "swagger"],
    categoryWeights: { backend: 0.34, devops: 0.22 },
    ecosystems: ["rest"],
    paradigms: ["specification"],
    tags: ["api"],
  },
  {
    name: "REST",
    aliases: ["rest", "restful"],
    categoryWeights: { backend: 0.42 },
    ecosystems: ["http"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "OpenSearch",
    aliases: ["opensearch", "elasticsearch", "elastic"],
    categoryWeights: { database: 0.56, backend: 0.26, infrastructure: 0.16 },
    ecosystems: ["search"],
    paradigms: ["index"],
    tags: ["analytics"],
  },
  {
    name: "Neo4j",
    aliases: ["neo4j"],
    categoryWeights: { database: 0.82 },
    ecosystems: ["graph"],
    paradigms: ["graph-db"],
    tags: ["data"],
  },
  {
    name: "JanusGraph",
    aliases: ["janusgraph"],
    categoryWeights: { database: 0.78 },
    ecosystems: ["graph"],
    paradigms: ["graph-db"],
    tags: ["data"],
  },
  {
    name: "Milvus",
    aliases: ["milvus"],
    categoryWeights: { database: 0.62, "ai-ml": 0.24 },
    ecosystems: ["vector"],
    paradigms: ["vector-db"],
    tags: ["retrieval"],
  },
  {
    name: "Qdrant",
    aliases: ["qdrant"],
    categoryWeights: { database: 0.62, "ai-ml": 0.24 },
    ecosystems: ["vector"],
    paradigms: ["vector-db"],
    tags: ["retrieval"],
  },
  {
    name: "Pinecone",
    aliases: ["pinecone"],
    categoryWeights: { database: 0.6, "ai-ml": 0.22 },
    ecosystems: ["vector"],
    paradigms: ["vector-db"],
    tags: ["retrieval"],
  },
  {
    name: "Chroma",
    aliases: ["chroma", "chromadb"],
    categoryWeights: { database: 0.58, "ai-ml": 0.24 },
    ecosystems: ["vector"],
    paradigms: ["vector-db"],
    tags: ["retrieval"],
  },
  {
    name: "Weaviate",
    aliases: ["weaviate"],
    categoryWeights: { database: 0.62, "ai-ml": 0.26 },
    ecosystems: ["vector"],
    paradigms: ["vector-db"],
    tags: ["retrieval"],
  },
  {
    name: "FAISS",
    aliases: ["faiss"],
    categoryWeights: { "ai-ml": 0.52, database: 0.26 },
    ecosystems: ["python", "c++"],
    paradigms: ["vector-index"],
    tags: ["retrieval"],
  },
  {
    name: "NumPy",
    aliases: ["numpy"],
    categoryWeights: { "ai-ml": 0.62, backend: 0.2 },
    ecosystems: ["python"],
    paradigms: ["numeric"],
    tags: ["science"],
  },
  {
    name: "Pandas",
    aliases: ["pandas"],
    categoryWeights: { "ai-ml": 0.6, database: 0.18 },
    ecosystems: ["python"],
    paradigms: ["analytics"],
    tags: ["science"],
  },
  {
    name: "Polars",
    aliases: ["polars"],
    categoryWeights: { "ai-ml": 0.56, database: 0.18 },
    ecosystems: ["python", "rust"],
    paradigms: ["analytics"],
    tags: ["science"],
  },
  {
    name: "scikit-learn",
    aliases: ["sklearn", "scikit-learn"],
    categoryWeights: { "ai-ml": 0.7 },
    ecosystems: ["python"],
    paradigms: ["ml"],
    tags: ["training"],
  },
  {
    name: "XGBoost",
    aliases: ["xgboost"],
    categoryWeights: { "ai-ml": 0.68 },
    ecosystems: ["python"],
    paradigms: ["ml"],
    tags: ["training"],
  },
  {
    name: "LightGBM",
    aliases: ["lightgbm"],
    categoryWeights: { "ai-ml": 0.68 },
    ecosystems: ["python"],
    paradigms: ["ml"],
    tags: ["training"],
  },
  {
    name: "CatBoost",
    aliases: ["catboost"],
    categoryWeights: { "ai-ml": 0.66 },
    ecosystems: ["python"],
    paradigms: ["ml"],
    tags: ["training"],
  },
  {
    name: "Keras",
    aliases: ["keras"],
    categoryWeights: { "ai-ml": 0.72 },
    ecosystems: ["tensorflow"],
    paradigms: ["deep-learning"],
    tags: ["training"],
  },
  {
    name: "MLflow",
    aliases: ["mlflow"],
    categoryWeights: { "ai-ml": 0.52, devops: 0.24 },
    ecosystems: ["python"],
    paradigms: ["mlops"],
    tags: ["tracking"],
  },
  {
    name: "Kubeflow",
    aliases: ["kubeflow"],
    categoryWeights: { "ai-ml": 0.54, infrastructure: 0.3, devops: 0.2 },
    ecosystems: ["kubernetes"],
    paradigms: ["mlops"],
    tags: ["pipelines"],
  },
  {
    name: "Argo",
    aliases: ["argo", "argocd", "argo-cd", "argo-workflows"],
    categoryWeights: { devops: 0.56, infrastructure: 0.4 },
    ecosystems: ["kubernetes"],
    paradigms: ["gitops"],
    tags: ["delivery"],
  },
  {
    name: "Flux",
    aliases: ["flux", "fluxcd", "flux-cd"],
    categoryWeights: { devops: 0.56, infrastructure: 0.4 },
    ecosystems: ["kubernetes"],
    paradigms: ["gitops"],
    tags: ["delivery"],
  },
  {
    name: "Jenkins",
    aliases: ["jenkins"],
    categoryWeights: { devops: 0.68 },
    ecosystems: ["groovy", "ci"],
    paradigms: ["ci-cd"],
    tags: ["delivery"],
  },
  {
    name: "GitHub Actions",
    aliases: ["githubactions", "github-action", "workflow", "workflows"],
    categoryWeights: { devops: 0.72, infrastructure: 0.18 },
    ecosystems: ["yaml", "ci"],
    paradigms: ["ci-cd"],
    tags: ["delivery"],
  },
  {
    name: "GitLab CI",
    aliases: ["gitlab-ci", "gitlabci"],
    categoryWeights: { devops: 0.72, infrastructure: 0.16 },
    ecosystems: ["yaml"],
    paradigms: ["ci-cd"],
    tags: ["delivery"],
  },
  {
    name: "CircleCI",
    aliases: ["circleci"],
    categoryWeights: { devops: 0.68 },
    ecosystems: ["yaml"],
    paradigms: ["ci-cd"],
    tags: ["delivery"],
  },
  {
    name: "Azure DevOps",
    aliases: ["azure-devops", "azdo"],
    categoryWeights: { devops: 0.66, infrastructure: 0.2 },
    ecosystems: ["yaml"],
    paradigms: ["ci-cd"],
    tags: ["delivery"],
  },
  {
    name: "Nomad",
    aliases: ["nomad"],
    categoryWeights: { infrastructure: 0.72, devops: 0.24 },
    ecosystems: ["hashicorp"],
    paradigms: ["orchestration"],
    tags: ["scheduling"],
  },
  {
    name: "Consul",
    aliases: ["consul"],
    categoryWeights: { infrastructure: 0.68, devops: 0.24 },
    ecosystems: ["hashicorp"],
    paradigms: ["service-discovery"],
    tags: ["network"],
  },
  {
    name: "Vault",
    aliases: ["vault", "hashicorp-vault"],
    categoryWeights: { infrastructure: 0.66, devops: 0.26 },
    ecosystems: ["hashicorp"],
    paradigms: ["secrets-management"],
    tags: ["security"],
  },
  {
    name: "OPA",
    aliases: ["opa", "open-policy-agent", "rego"],
    categoryWeights: { infrastructure: 0.62, devops: 0.24 },
    ecosystems: ["kubernetes"],
    paradigms: ["policy"],
    tags: ["security"],
  },
  {
    name: "Trivy",
    aliases: ["trivy"],
    categoryWeights: { devops: 0.58, infrastructure: 0.2 },
    ecosystems: ["containers"],
    paradigms: ["security"],
    tags: ["scanning"],
  },
  {
    name: "Snyk",
    aliases: ["snyk"],
    categoryWeights: { devops: 0.56, infrastructure: 0.2 },
    ecosystems: ["dependencies"],
    paradigms: ["security"],
    tags: ["scanning"],
  },
  {
    name: "SonarQube",
    aliases: ["sonarqube", "sonar"],
    categoryWeights: { devops: 0.46, backend: 0.18 },
    ecosystems: ["ci"],
    paradigms: ["quality"],
    tags: ["analysis"],
  },
  {
    name: "Playwright",
    aliases: ["playwright"],
    categoryWeights: { frontend: 0.36, backend: 0.2, devops: 0.22 },
    ecosystems: ["typescript", "javascript"],
    paradigms: ["testing"],
    tags: ["e2e"],
  },
  {
    name: "Cypress",
    aliases: ["cypress"],
    categoryWeights: { frontend: 0.34, devops: 0.2 },
    ecosystems: ["javascript"],
    paradigms: ["testing"],
    tags: ["e2e"],
  },
  {
    name: "Jest",
    aliases: ["jest"],
    categoryWeights: { frontend: 0.22, backend: 0.24, devops: 0.16 },
    ecosystems: ["javascript", "typescript"],
    paradigms: ["testing"],
    tags: ["unit-test"],
  },
  {
    name: "Vitest",
    aliases: ["vitest"],
    categoryWeights: { frontend: 0.24, backend: 0.2, devops: 0.16 },
    ecosystems: ["typescript", "vite"],
    paradigms: ["testing"],
    tags: ["unit-test"],
  },
  {
    name: "Pytest",
    aliases: ["pytest"],
    categoryWeights: { backend: 0.24, "ai-ml": 0.16, devops: 0.14 },
    ecosystems: ["python"],
    paradigms: ["testing"],
    tags: ["unit-test"],
  },
  {
    name: "JUnit",
    aliases: ["junit"],
    categoryWeights: { backend: 0.24, devops: 0.12 },
    ecosystems: ["java"],
    paradigms: ["testing"],
    tags: ["unit-test"],
  },
  {
    name: "Postman",
    aliases: ["postman"],
    categoryWeights: { backend: 0.24, devops: 0.16 },
    ecosystems: ["api"],
    paradigms: ["testing"],
    tags: ["api-test"],
  },
  {
    name: "Insomnia",
    aliases: ["insomnia"],
    categoryWeights: { backend: 0.22, devops: 0.14 },
    ecosystems: ["api"],
    paradigms: ["testing"],
    tags: ["api-test"],
  },
  {
    name: "FastAPI",
    aliases: ["fastapi"],
    categoryWeights: { backend: 0.72, "ai-ml": 0.26 },
    ecosystems: ["python", "pydantic"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Django",
    aliases: ["django"],
    categoryWeights: { backend: 0.74 },
    ecosystems: ["python", "orm"],
    paradigms: ["mvc"],
    tags: ["web"],
  },
  {
    name: "Flask",
    aliases: ["flask"],
    categoryWeights: { backend: 0.68 },
    ecosystems: ["python"],
    paradigms: ["microframework"],
    tags: ["web"],
  },
  {
    name: "Express",
    aliases: ["express"],
    categoryWeights: { backend: 0.66 },
    ecosystems: ["node"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "NestJS",
    aliases: ["nestjs", "nest"],
    categoryWeights: { backend: 0.72 },
    ecosystems: ["typescript", "node"],
    paradigms: ["modular"],
    tags: ["web"],
  },
  {
    name: "Spring Boot",
    aliases: ["spring", "springboot"],
    categoryWeights: { backend: 0.76 },
    ecosystems: ["java"],
    paradigms: ["enterprise"],
    tags: ["web"],
  },
  {
    name: "Quarkus",
    aliases: ["quarkus"],
    categoryWeights: { backend: 0.66 },
    ecosystems: ["java"],
    paradigms: ["microservices"],
    tags: ["web"],
  },
  {
    name: "Ktor",
    aliases: ["ktor"],
    categoryWeights: { backend: 0.64 },
    ecosystems: ["kotlin"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "ASP.NET",
    aliases: ["aspnet", "asp.net"],
    categoryWeights: { backend: 0.74 },
    ecosystems: ["dotnet"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Laravel",
    aliases: ["laravel"],
    categoryWeights: { backend: 0.68 },
    ecosystems: ["php"],
    paradigms: ["mvc"],
    tags: ["web"],
  },
  {
    name: "Symfony",
    aliases: ["symfony"],
    categoryWeights: { backend: 0.66 },
    ecosystems: ["php"],
    paradigms: ["mvc"],
    tags: ["web"],
  },
  {
    name: "Rails",
    aliases: ["rails"],
    categoryWeights: { backend: 0.7 },
    ecosystems: ["ruby"],
    paradigms: ["mvc"],
    tags: ["web"],
  },
  {
    name: "Phoenix",
    aliases: ["phoenix"],
    categoryWeights: { backend: 0.66 },
    ecosystems: ["elixir"],
    paradigms: ["realtime"],
    tags: ["web"],
  },
  {
    name: "Actix",
    aliases: ["actix"],
    categoryWeights: { backend: 0.64 },
    ecosystems: ["rust"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Axum",
    aliases: ["axum"],
    categoryWeights: { backend: 0.64 },
    ecosystems: ["rust"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Gin",
    aliases: ["gin"],
    categoryWeights: { backend: 0.64 },
    ecosystems: ["go"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Fiber",
    aliases: ["fiber"],
    categoryWeights: { backend: 0.64 },
    ecosystems: ["go"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "gofiber",
    aliases: ["gofiber"],
    categoryWeights: { backend: 0.64 },
    ecosystems: ["go"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Echo",
    aliases: ["echo"],
    categoryWeights: { backend: 0.62 },
    ecosystems: ["go"],
    paradigms: ["api"],
    tags: ["web"],
  },
  {
    name: "Serverless",
    aliases: ["serverless", "lambda", "cloud-function", "cloudfunctions"],
    categoryWeights: { infrastructure: 0.42, backend: 0.36, devops: 0.26 },
    ecosystems: ["aws", "gcp", "azure"],
    paradigms: ["faas"],
    tags: ["cloud"],
  },
  {
    name: "Cloudflare Workers",
    aliases: ["cloudflare-workers", "workers"],
    categoryWeights: { backend: 0.48, infrastructure: 0.24, frontend: 0.22 },
    ecosystems: ["edge"],
    paradigms: ["serverless"],
    tags: ["cdn"],
  },
  {
    name: "Vercel",
    aliases: ["vercel"],
    categoryWeights: { frontend: 0.34, infrastructure: 0.24, devops: 0.22 },
    ecosystems: ["nextjs"],
    paradigms: ["deployment"],
    tags: ["platform"],
  },
  {
    name: "Netlify",
    aliases: ["netlify"],
    categoryWeights: { frontend: 0.32, infrastructure: 0.24, devops: 0.22 },
    ecosystems: ["jamstack"],
    paradigms: ["deployment"],
    tags: ["platform"],
  },
  {
    name: "CDK",
    aliases: ["cdk", "aws-cdk"],
    categoryWeights: { infrastructure: 0.72, devops: 0.26 },
    ecosystems: ["aws", "typescript", "python"],
    paradigms: ["iac"],
    tags: ["cloud"],
  },
  {
    name: "Pulumi ESC",
    aliases: ["pulumi-esc", "esc"],
    categoryWeights: { infrastructure: 0.58, devops: 0.28 },
    ecosystems: ["pulumi"],
    paradigms: ["secrets"],
    tags: ["cloud"],
  },
  {
    name: "Clojure",
    aliases: ["clojure", "clj"],
    categoryWeights: { backend: 0.62 },
    ecosystems: ["lein", "babashka"],
    paradigms: ["functional"],
    tags: ["jvm"],
  },
  {
    name: "ClojureScript",
    aliases: ["clojurescript", "cljs"],
    categoryWeights: { frontend: 0.64, backend: 0.26 },
    ecosystems: ["reagent"],
    paradigms: ["functional"],
    tags: ["web"],
  },
  {
    name: "Nim",
    aliases: ["nim"],
    categoryWeights: { backend: 0.6, infrastructure: 0.36 },
    ecosystems: ["nimble"],
    paradigms: ["compiled"],
    tags: ["systems"],
  },
  {
    name: "Crystal",
    aliases: ["crystal"],
    categoryWeights: { backend: 0.62 },
    ecosystems: ["shards"],
    paradigms: ["compiled"],
    tags: ["web"],
  },
  {
    name: "Fortran",
    aliases: ["fortran"],
    categoryWeights: { backend: 0.42, "ai-ml": 0.28 },
    ecosystems: ["hpc"],
    paradigms: ["scientific"],
    tags: ["numeric"],
  },
  {
    name: "COBOL",
    aliases: ["cobol"],
    categoryWeights: { backend: 0.54 },
    ecosystems: ["mainframe"],
    paradigms: ["enterprise"],
    tags: ["legacy"],
  },
  {
    name: "ABAP",
    aliases: ["abap"],
    categoryWeights: { backend: 0.56 },
    ecosystems: ["sap"],
    paradigms: ["enterprise"],
    tags: ["erp"],
  },
  {
    name: "SAS",
    aliases: ["sas"],
    categoryWeights: { "ai-ml": 0.42, database: 0.2 },
    ecosystems: ["analytics"],
    paradigms: ["statistics"],
    tags: ["data"],
  },
  {
    name: "Julia",
    aliases: ["julia"],
    categoryWeights: { "ai-ml": 0.64, backend: 0.24 },
    ecosystems: ["flux"],
    paradigms: ["numerical"],
    tags: ["science"],
  },
  {
    name: "Apache Beam",
    aliases: ["beam", "apache-beam"],
    categoryWeights: { "ai-ml": 0.34, backend: 0.3, database: 0.2 },
    ecosystems: ["python", "java"],
    paradigms: ["pipelines"],
    tags: ["data"],
  },
  {
    name: "Flink",
    aliases: ["flink"],
    categoryWeights: { backend: 0.38, database: 0.24, "ai-ml": 0.18 },
    ecosystems: ["java", "scala"],
    paradigms: ["streaming"],
    tags: ["data"],
  },
  {
    name: "Beam SQL",
    aliases: ["beam-sql"],
    categoryWeights: { database: 0.34, backend: 0.18, "ai-ml": 0.16 },
    ecosystems: ["beam"],
    paradigms: ["query"],
    tags: ["data"],
  },
  {
    name: "Celery",
    aliases: ["celery"],
    categoryWeights: { backend: 0.42, devops: 0.18 },
    ecosystems: ["python", "redis", "rabbitmq"],
    paradigms: ["task-queue"],
    tags: ["jobs"],
  },
  {
    name: "Temporal",
    aliases: ["temporal"],
    categoryWeights: { backend: 0.46, devops: 0.2 },
    ecosystems: ["go", "java", "typescript"],
    paradigms: ["workflow"],
    tags: ["jobs"],
  },
  {
    name: "Camunda",
    aliases: ["camunda"],
    categoryWeights: { backend: 0.4, devops: 0.18 },
    ecosystems: ["java"],
    paradigms: ["workflow"],
    tags: ["jobs"],
  },
  {
    name: "OpenCV",
    aliases: ["opencv"],
    categoryWeights: { "ai-ml": 0.54, backend: 0.22 },
    ecosystems: ["python", "c++"],
    paradigms: ["computer-vision"],
    tags: ["cv"],
  },
  {
    name: "PCL",
    aliases: ["pcl", "point-cloud-library"],
    categoryWeights: { "ai-ml": 0.44, backend: 0.2 },
    ecosystems: ["c++"],
    paradigms: ["computer-vision"],
    tags: ["cv"],
  },
  {
    name: "ROS",
    aliases: ["ros", "ros2"],
    categoryWeights: { "ai-ml": 0.38, infrastructure: 0.18, backend: 0.24 },
    ecosystems: ["python", "c++"],
    paradigms: ["robotics"],
    tags: ["automation"],
  },
];

const WEIGHTED_KEYWORDS: WeightedKeyword[] = [
  {
    token: "frontend",
    category: "frontend",
    weight: 0.56,
    reason: "frontend marker",
  },
  {
    token: "web",
    category: "frontend",
    weight: 0.24,
    reason: "web surface marker",
  },
  { token: "ui", category: "frontend", weight: 0.52, reason: "ui marker" },
  { token: "ux", category: "frontend", weight: 0.42, reason: "ux marker" },
  { token: "dom", category: "frontend", weight: 0.5, reason: "dom marker" },
  {
    token: "component",
    category: "frontend",
    weight: 0.48,
    reason: "component marker",
  },
  {
    token: "tailwind",
    category: "frontend",
    weight: 0.44,
    reason: "tailwind marker",
  },
  { token: "css", category: "frontend", weight: 0.52, reason: "css marker" },
  { token: "scss", category: "frontend", weight: 0.48, reason: "scss marker" },
  { token: "sass", category: "frontend", weight: 0.44, reason: "sass marker" },
  { token: "html", category: "frontend", weight: 0.56, reason: "html marker" },
  {
    token: "react",
    category: "frontend",
    weight: 0.56,
    reason: "react marker",
  },
  {
    token: "nextjs",
    category: "frontend",
    weight: 0.56,
    reason: "nextjs marker",
  },
  { token: "next", category: "frontend", weight: 0.34, reason: "next marker" },
  { token: "vue", category: "frontend", weight: 0.54, reason: "vue marker" },
  { token: "nuxt", category: "frontend", weight: 0.46, reason: "nuxt marker" },
  {
    token: "svelte",
    category: "frontend",
    weight: 0.5,
    reason: "svelte marker",
  },
  {
    token: "astro",
    category: "frontend",
    weight: 0.46,
    reason: "astro marker",
  },
  {
    token: "angular",
    category: "frontend",
    weight: 0.5,
    reason: "angular marker",
  },
  { token: "vite", category: "frontend", weight: 0.38, reason: "vite marker" },
  {
    token: "webpack",
    category: "frontend",
    weight: 0.28,
    reason: "webpack marker",
  },
  {
    token: "rollup",
    category: "frontend",
    weight: 0.24,
    reason: "rollup marker",
  },
  {
    token: "storybook",
    category: "frontend",
    weight: 0.42,
    reason: "storybook marker",
  },
  {
    token: "design-system",
    category: "frontend",
    weight: 0.46,
    reason: "design-system marker",
  },
  {
    token: "chakra",
    category: "frontend",
    weight: 0.34,
    reason: "chakra marker",
  },
  {
    token: "material",
    category: "frontend",
    weight: 0.26,
    reason: "material marker",
  },

  {
    token: "backend",
    category: "backend",
    weight: 0.56,
    reason: "backend marker",
  },
  { token: "api", category: "backend", weight: 0.42, reason: "api marker" },
  {
    token: "server",
    category: "backend",
    weight: 0.46,
    reason: "server marker",
  },
  {
    token: "service",
    category: "backend",
    weight: 0.34,
    reason: "service marker",
  },
  {
    token: "microservice",
    category: "backend",
    weight: 0.52,
    reason: "microservice marker",
  },
  { token: "http", category: "backend", weight: 0.24, reason: "http marker" },
  { token: "rest", category: "backend", weight: 0.42, reason: "rest marker" },
  {
    token: "graphql",
    category: "backend",
    weight: 0.38,
    reason: "graphql marker",
  },
  { token: "grpc", category: "backend", weight: 0.42, reason: "grpc marker" },
  { token: "auth", category: "backend", weight: 0.26, reason: "auth marker" },
  { token: "oauth", category: "backend", weight: 0.32, reason: "oauth marker" },
  { token: "jwt", category: "backend", weight: 0.28, reason: "jwt marker" },
  {
    token: "express",
    category: "backend",
    weight: 0.42,
    reason: "express marker",
  },
  {
    token: "nestjs",
    category: "backend",
    weight: 0.44,
    reason: "nestjs marker",
  },
  {
    token: "django",
    category: "backend",
    weight: 0.44,
    reason: "django marker",
  },
  { token: "flask", category: "backend", weight: 0.38, reason: "flask marker" },
  {
    token: "fastapi",
    category: "backend",
    weight: 0.46,
    reason: "fastapi marker",
  },
  {
    token: "spring",
    category: "backend",
    weight: 0.44,
    reason: "spring marker",
  },
  {
    token: "laravel",
    category: "backend",
    weight: 0.42,
    reason: "laravel marker",
  },
  {
    token: "symfony",
    category: "backend",
    weight: 0.4,
    reason: "symfony marker",
  },
  { token: "rails", category: "backend", weight: 0.4, reason: "rails marker" },
  {
    token: "phoenix",
    category: "backend",
    weight: 0.4,
    reason: "phoenix marker",
  },
  { token: "actix", category: "backend", weight: 0.34, reason: "actix marker" },
  { token: "axum", category: "backend", weight: 0.34, reason: "axum marker" },
  { token: "gin", category: "backend", weight: 0.34, reason: "gin marker" },
  { token: "fiber", category: "backend", weight: 0.34, reason: "fiber marker" },

  {
    token: "database",
    category: "database",
    weight: 0.58,
    reason: "database marker",
  },
  { token: "db", category: "database", weight: 0.4, reason: "db marker" },
  { token: "sql", category: "database", weight: 0.54, reason: "sql marker" },
  {
    token: "postgres",
    category: "database",
    weight: 0.58,
    reason: "postgres marker",
  },
  {
    token: "postgresql",
    category: "database",
    weight: 0.58,
    reason: "postgresql marker",
  },
  {
    token: "mysql",
    category: "database",
    weight: 0.54,
    reason: "mysql marker",
  },
  {
    token: "mariadb",
    category: "database",
    weight: 0.52,
    reason: "mariadb marker",
  },
  {
    token: "sqlite",
    category: "database",
    weight: 0.52,
    reason: "sqlite marker",
  },
  {
    token: "mongodb",
    category: "database",
    weight: 0.56,
    reason: "mongodb marker",
  },
  {
    token: "mongo",
    category: "database",
    weight: 0.46,
    reason: "mongo marker",
  },
  { token: "redis", category: "database", weight: 0.5, reason: "redis marker" },
  {
    token: "cassandra",
    category: "database",
    weight: 0.5,
    reason: "cassandra marker",
  },
  {
    token: "dynamodb",
    category: "database",
    weight: 0.46,
    reason: "dynamodb marker",
  },
  {
    token: "clickhouse",
    category: "database",
    weight: 0.5,
    reason: "clickhouse marker",
  },
  {
    token: "snowflake",
    category: "database",
    weight: 0.46,
    reason: "snowflake marker",
  },
  {
    token: "bigquery",
    category: "database",
    weight: 0.46,
    reason: "bigquery marker",
  },
  {
    token: "redshift",
    category: "database",
    weight: 0.44,
    reason: "redshift marker",
  },
  {
    token: "prisma",
    category: "database",
    weight: 0.44,
    reason: "prisma marker",
  },
  {
    token: "typeorm",
    category: "database",
    weight: 0.44,
    reason: "typeorm marker",
  },
  {
    token: "sequelize",
    category: "database",
    weight: 0.42,
    reason: "sequelize marker",
  },
  {
    token: "sqlalchemy",
    category: "database",
    weight: 0.42,
    reason: "sqlalchemy marker",
  },
  { token: "dbt", category: "database", weight: 0.42, reason: "dbt marker" },
  {
    token: "warehouse",
    category: "database",
    weight: 0.4,
    reason: "warehouse marker",
  },
  {
    token: "vector",
    category: "database",
    weight: 0.34,
    reason: "vector store marker",
  },
  {
    token: "milvus",
    category: "database",
    weight: 0.5,
    reason: "milvus marker",
  },
  {
    token: "qdrant",
    category: "database",
    weight: 0.5,
    reason: "qdrant marker",
  },
  {
    token: "pinecone",
    category: "database",
    weight: 0.46,
    reason: "pinecone marker",
  },
  {
    token: "weaviate",
    category: "database",
    weight: 0.48,
    reason: "weaviate marker",
  },

  {
    token: "infra",
    category: "infrastructure",
    weight: 0.54,
    reason: "infra marker",
  },
  {
    token: "infrastructure",
    category: "infrastructure",
    weight: 0.56,
    reason: "infrastructure marker",
  },
  {
    token: "iac",
    category: "infrastructure",
    weight: 0.52,
    reason: "iac marker",
  },
  {
    token: "terraform",
    category: "infrastructure",
    weight: 0.62,
    reason: "terraform marker",
  },
  {
    token: "pulumi",
    category: "infrastructure",
    weight: 0.6,
    reason: "pulumi marker",
  },
  {
    token: "bicep",
    category: "infrastructure",
    weight: 0.58,
    reason: "bicep marker",
  },
  {
    token: "ansible",
    category: "infrastructure",
    weight: 0.58,
    reason: "ansible marker",
  },
  {
    token: "helm",
    category: "infrastructure",
    weight: 0.6,
    reason: "helm marker",
  },
  {
    token: "kubernetes",
    category: "infrastructure",
    weight: 0.64,
    reason: "kubernetes marker",
  },
  {
    token: "k8s",
    category: "infrastructure",
    weight: 0.62,
    reason: "k8s marker",
  },
  {
    token: "nomad",
    category: "infrastructure",
    weight: 0.54,
    reason: "nomad marker",
  },
  {
    token: "consul",
    category: "infrastructure",
    weight: 0.48,
    reason: "consul marker",
  },
  {
    token: "vault",
    category: "infrastructure",
    weight: 0.48,
    reason: "vault marker",
  },
  {
    token: "cloud",
    category: "infrastructure",
    weight: 0.46,
    reason: "cloud marker",
  },
  {
    token: "aws",
    category: "infrastructure",
    weight: 0.54,
    reason: "aws marker",
  },
  {
    token: "azure",
    category: "infrastructure",
    weight: 0.54,
    reason: "azure marker",
  },
  {
    token: "gcp",
    category: "infrastructure",
    weight: 0.54,
    reason: "gcp marker",
  },
  {
    token: "opentelemetry",
    category: "infrastructure",
    weight: 0.26,
    reason: "otel infra marker",
  },
  {
    token: "mesh",
    category: "infrastructure",
    weight: 0.38,
    reason: "mesh marker",
  },
  {
    token: "istio",
    category: "infrastructure",
    weight: 0.56,
    reason: "istio marker",
  },
  {
    token: "envoy",
    category: "infrastructure",
    weight: 0.5,
    reason: "envoy marker",
  },
  {
    token: "gateway",
    category: "infrastructure",
    weight: 0.34,
    reason: "gateway marker",
  },

  {
    token: "devops",
    category: "devops",
    weight: 0.62,
    reason: "devops marker",
  },
  { token: "ci", category: "devops", weight: 0.48, reason: "ci marker" },
  { token: "cd", category: "devops", weight: 0.48, reason: "cd marker" },
  {
    token: "pipeline",
    category: "devops",
    weight: 0.44,
    reason: "pipeline marker",
  },
  {
    token: "workflow",
    category: "devops",
    weight: 0.44,
    reason: "workflow marker",
  },
  {
    token: "github-actions",
    category: "devops",
    weight: 0.62,
    reason: "gha marker",
  },
  {
    token: "githubactions",
    category: "devops",
    weight: 0.62,
    reason: "gha marker",
  },
  {
    token: "gitlab-ci",
    category: "devops",
    weight: 0.62,
    reason: "gitlab ci marker",
  },
  {
    token: "jenkins",
    category: "devops",
    weight: 0.58,
    reason: "jenkins marker",
  },
  {
    token: "circleci",
    category: "devops",
    weight: 0.56,
    reason: "circleci marker",
  },
  {
    token: "docker",
    category: "devops",
    weight: 0.58,
    reason: "docker marker",
  },
  {
    token: "dockerfile",
    category: "devops",
    weight: 0.6,
    reason: "dockerfile marker",
  },
  {
    token: "compose",
    category: "devops",
    weight: 0.5,
    reason: "compose marker",
  },
  { token: "shell", category: "devops", weight: 0.52, reason: "shell marker" },
  { token: "bash", category: "devops", weight: 0.52, reason: "bash marker" },
  {
    token: "powershell",
    category: "devops",
    weight: 0.5,
    reason: "powershell marker",
  },
  { token: "yaml", category: "devops", weight: 0.46, reason: "yaml marker" },
  { token: "nix", category: "devops", weight: 0.46, reason: "nix marker" },
  {
    token: "makefile",
    category: "devops",
    weight: 0.48,
    reason: "makefile marker",
  },
  {
    token: "monitoring",
    category: "devops",
    weight: 0.38,
    reason: "monitoring marker",
  },
  {
    token: "prometheus",
    category: "devops",
    weight: 0.5,
    reason: "prometheus marker",
  },
  {
    token: "grafana",
    category: "devops",
    weight: 0.48,
    reason: "grafana marker",
  },
  {
    token: "tracing",
    category: "devops",
    weight: 0.36,
    reason: "tracing marker",
  },
  {
    token: "logging",
    category: "devops",
    weight: 0.34,
    reason: "logging marker",
  },
  {
    token: "gitops",
    category: "devops",
    weight: 0.46,
    reason: "gitops marker",
  },

  { token: "ai", category: "ai-ml", weight: 0.54, reason: "ai marker" },
  { token: "ml", category: "ai-ml", weight: 0.54, reason: "ml marker" },
  {
    token: "machine-learning",
    category: "ai-ml",
    weight: 0.58,
    reason: "machine-learning marker",
  },
  {
    token: "machinelearning",
    category: "ai-ml",
    weight: 0.58,
    reason: "machinelearning marker",
  },
  {
    token: "deep-learning",
    category: "ai-ml",
    weight: 0.58,
    reason: "deep-learning marker",
  },
  {
    token: "deeplearning",
    category: "ai-ml",
    weight: 0.58,
    reason: "deeplearning marker",
  },
  { token: "llm", category: "ai-ml", weight: 0.6, reason: "llm marker" },
  { token: "rag", category: "ai-ml", weight: 0.58, reason: "rag marker" },
  { token: "nlp", category: "ai-ml", weight: 0.56, reason: "nlp marker" },
  {
    token: "inference",
    category: "ai-ml",
    weight: 0.5,
    reason: "inference marker",
  },
  {
    token: "training",
    category: "ai-ml",
    weight: 0.54,
    reason: "training marker",
  },
  { token: "cuda", category: "ai-ml", weight: 0.56, reason: "cuda marker" },
  { token: "gpu", category: "ai-ml", weight: 0.52, reason: "gpu marker" },
  { token: "tensor", category: "ai-ml", weight: 0.48, reason: "tensor marker" },
  {
    token: "tensorflow",
    category: "ai-ml",
    weight: 0.62,
    reason: "tensorflow marker",
  },
  {
    token: "pytorch",
    category: "ai-ml",
    weight: 0.64,
    reason: "pytorch marker",
  },
  {
    token: "sklearn",
    category: "ai-ml",
    weight: 0.58,
    reason: "sklearn marker",
  },
  {
    token: "xgboost",
    category: "ai-ml",
    weight: 0.56,
    reason: "xgboost marker",
  },
  {
    token: "lightgbm",
    category: "ai-ml",
    weight: 0.56,
    reason: "lightgbm marker",
  },
  {
    token: "catboost",
    category: "ai-ml",
    weight: 0.56,
    reason: "catboost marker",
  },
  {
    token: "jupyter",
    category: "ai-ml",
    weight: 0.56,
    reason: "jupyter marker",
  },
  {
    token: "notebook",
    category: "ai-ml",
    weight: 0.52,
    reason: "notebook marker",
  },
  {
    token: "transformers",
    category: "ai-ml",
    weight: 0.58,
    reason: "transformers marker",
  },
  {
    token: "huggingface",
    category: "ai-ml",
    weight: 0.58,
    reason: "huggingface marker",
  },
  {
    token: "langchain",
    category: "ai-ml",
    weight: 0.56,
    reason: "langchain marker",
  },
  {
    token: "llamaindex",
    category: "ai-ml",
    weight: 0.56,
    reason: "llamaindex marker",
  },
  {
    token: "vector-db",
    category: "ai-ml",
    weight: 0.42,
    reason: "vector marker",
  },
  {
    token: "retrieval",
    category: "ai-ml",
    weight: 0.42,
    reason: "retrieval marker",
  },
  {
    token: "embedding",
    category: "ai-ml",
    weight: 0.48,
    reason: "embedding marker",
  },
  {
    token: "feature-store",
    category: "ai-ml",
    weight: 0.38,
    reason: "feature-store marker",
  },
];

const REGEX_RULES: RegexRule[] = [
  {
    pattern: /\b(front|ui|ux|component|spa|ssr|ssg)\b/i,
    category: "frontend",
    weight: 0.24,
    reason: "frontend regex marker",
  },
  {
    pattern: /\b(next(?:\.js)?|react|vue|svelte|astro|angular)\b/i,
    category: "frontend",
    weight: 0.34,
    reason: "frontend framework marker",
  },
  {
    pattern: /\b(css|sass|scss|tailwind|postcss|dom|html)\b/i,
    category: "frontend",
    weight: 0.28,
    reason: "frontend styling marker",
  },

  {
    pattern: /\b(api|backend|server|microservice|auth|rest|graphql|grpc)\b/i,
    category: "backend",
    weight: 0.28,
    reason: "backend regex marker",
  },
  {
    pattern:
      /\b(express|nestjs|django|flask|fastapi|spring|laravel|rails|phoenix)\b/i,
    category: "backend",
    weight: 0.32,
    reason: "backend framework marker",
  },

  {
    pattern:
      /\b(sql|postgres|mysql|sqlite|mongo|redis|cassandra|warehouse|db)\b/i,
    category: "database",
    weight: 0.34,
    reason: "database marker",
  },
  {
    pattern:
      /\b(prisma|typeorm|sequelize|sqlalchemy|dbt|clickhouse|bigquery|redshift)\b/i,
    category: "database",
    weight: 0.3,
    reason: "database ecosystem marker",
  },

  {
    pattern:
      /\b(terraform|pulumi|ansible|helm|kubernetes|k8s|cloud|iac|infra)\b/i,
    category: "infrastructure",
    weight: 0.34,
    reason: "infrastructure marker",
  },
  {
    pattern: /\b(aws|azure|gcp|nomad|consul|vault|bicep|hcl|istio|envoy)\b/i,
    category: "infrastructure",
    weight: 0.3,
    reason: "infrastructure ecosystem marker",
  },

  {
    pattern:
      /\b(devops|ci|cd|pipeline|workflow|github actions|jenkins|gitops)\b/i,
    category: "devops",
    weight: 0.34,
    reason: "devops marker",
  },
  {
    pattern:
      /\b(docker|compose|shell|bash|powershell|yaml|nix|makefile|prometheus|grafana)\b/i,
    category: "devops",
    weight: 0.3,
    reason: "devops tooling marker",
  },

  {
    pattern:
      /\b(ai|ml|llm|rag|nlp|inference|training|deep learning|machine learning)\b/i,
    category: "ai-ml",
    weight: 0.36,
    reason: "ai-ml marker",
  },
  {
    pattern:
      /\b(pytorch|tensorflow|sklearn|xgboost|jupyter|cuda|transformers|huggingface|langchain|llamaindex)\b/i,
    category: "ai-ml",
    weight: 0.34,
    reason: "ai-ml ecosystem marker",
  },
];

const aliasToLanguage = new Map<string, string>();
for (const profile of LANGUAGE_PROFILES) {
  aliasToLanguage.set(normalizeToken(profile.name), profile.name);
  for (const alias of profile.aliases) {
    aliasToLanguage.set(normalizeToken(alias), profile.name);
  }
}

const profileByName = new Map<string, LanguageCategoryProfile>();
for (const profile of LANGUAGE_PROFILES) {
  profileByName.set(profile.name, profile);
}

const keywordByToken = new Map<string, WeightedKeyword[]>();
for (const keyword of WEIGHTED_KEYWORDS) {
  const token = normalizeToken(keyword.token);
  const list = keywordByToken.get(token) || [];
  list.push(keyword);
  keywordByToken.set(token, list);
}

function initializeScores(): Record<SkillCategory, number> {
  return {
    frontend: 0,
    backend: 0,
    infrastructure: 0,
    database: 0,
    "ai-ml": 0,
    devops: 0,
  };
}

function applyProfileWeights(
  scores: Record<SkillCategory, number>,
  reasons: Record<SkillCategory, string[]>,
  profile: LanguageCategoryProfile,
): void {
  for (const category of CATEGORIES) {
    const weight = profile.categoryWeights[category] || 0;
    if (weight <= 0) continue;

    scores[category] += weight;
    reasons[category].push(`profile(${profile.name}) +${weight.toFixed(3)}`);
  }
}

function applyKeywordWeights(
  scores: Record<SkillCategory, number>,
  reasons: Record<SkillCategory, string[]>,
  tokens: string[],
): void {
  for (const token of tokens) {
    const keywords = keywordByToken.get(token);
    if (!keywords) continue;

    for (const keyword of keywords) {
      scores[keyword.category] += keyword.weight;
      reasons[keyword.category].push(
        `keyword(${token}:${keyword.reason}) +${keyword.weight.toFixed(3)}`,
      );
    }
  }
}

function applyRegexWeights(
  scores: Record<SkillCategory, number>,
  reasons: Record<SkillCategory, string[]>,
  corpus: string,
): void {
  for (const rule of REGEX_RULES) {
    if (!rule.pattern.test(corpus)) continue;

    scores[rule.category] += rule.weight;
    reasons[rule.category].push(
      `regex(${rule.reason}) +${rule.weight.toFixed(3)}`,
    );
  }
}

function scoreSpread(scores: Record<SkillCategory, number>): {
  max: number;
  second: number;
} {
  const sorted = Object.values(scores).sort((a, b) => b - a);
  return {
    max: sorted[0] || 0,
    second: sorted[1] || 0,
  };
}

function confidenceFromScores(
  scores: Record<SkillCategory, number>,
  winner: SkillCategory,
): number {
  const spread = scoreSpread(scores);
  const total = Object.values(scores).reduce((sum, value) => sum + value, 0);
  if (spread.max <= 0 || total <= 0) return 0.2;

  const dominance = spread.max / Math.max(1e-9, total);
  const margin = (spread.max - spread.second) / Math.max(1e-9, spread.max);
  const confidence = 0.32 + dominance * 0.38 + margin * 0.3;

  if (winner === "backend" && scores.backend < 0.5) {
    return Math.max(0.22, confidence * 0.82);
  }

  return Math.min(0.99, Math.max(0.2, confidence));
}

function deriveBreakdown(
  scores: Record<SkillCategory, number>,
  reasons: Record<SkillCategory, string[]>,
): CategoryScoreBreakdown[] {
  return CATEGORIES.map((category) => ({
    category,
    score: Number(scores[category].toFixed(6)),
    reasons: reasons[category].slice(0, 6),
  })).sort((a, b) => b.score - a.score);
}

function canonicalizeLanguageName(language: string): string {
  const normalized = normalizeToken(language);
  const direct = aliasToLanguage.get(normalized);
  if (direct) return direct;

  if (language === "C#" || language === "C++") return language;
  if (language === "Dockerfile") return language;

  const compact = language.trim();
  if (!compact) return language;

  return compact
    .split(/\s+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

const inferenceCache = new Map<string, CategoryInferenceResult>();

export function inferLanguageCategoryExpert(
  language: string,
): CategoryInferenceResult {
  const raw = language || "";
  const cacheKey = normalizeToken(raw);
  const cached = inferenceCache.get(cacheKey);
  if (cached) return cached;

  const normalizedLanguage = canonicalizeLanguageName(raw);
  const profile = profileByName.get(normalizedLanguage);
  const scores = initializeScores();
  const reasons: Record<SkillCategory, string[]> = {
    frontend: [],
    backend: [],
    infrastructure: [],
    database: [],
    "ai-ml": [],
    devops: [],
  };

  if (profile) {
    applyProfileWeights(scores, reasons, profile);
  }

  const tokenCorpus = [
    normalizedLanguage,
    raw,
    ...(profile?.aliases || []),
    ...(profile?.ecosystems || []),
    ...(profile?.tags || []),
  ]
    .join(" ")
    .trim();
  const tokens = splitTokens(tokenCorpus);

  applyKeywordWeights(scores, reasons, tokens);
  applyRegexWeights(scores, reasons, tokenCorpus);

  if (Object.values(scores).every((value) => value <= 0)) {
    scores.backend += 0.22;
    reasons.backend.push("fallback(default-backend) +0.220");
  }

  const winner = CATEGORIES.reduce<SkillCategory>(
    (best, category) => (scores[category] > scores[best] ? category : best),
    "backend",
  );

  const confidence = confidenceFromScores(scores, winner);
  const breakdown = deriveBreakdown(scores, reasons);

  const result: CategoryInferenceResult = {
    category: winner,
    confidence,
    normalizedLanguage,
    breakdown,
  };

  inferenceCache.set(cacheKey, result);
  return result;
}

export function getLanguageCategoryHints(): Record<string, SkillCategory> {
  const hints: Record<string, SkillCategory> = {};

  for (const profile of LANGUAGE_PROFILES) {
    const inferred = inferLanguageCategoryExpert(profile.name);
    hints[profile.name] = inferred.category;
  }

  return hints;
}

export function getLanguageAliasMap(): Record<string, string> {
  const aliasMap: Record<string, string> = {};

  for (const profile of LANGUAGE_PROFILES) {
    for (const alias of profile.aliases) {
      aliasMap[normalizeToken(alias)] = profile.name;
    }
  }

  return aliasMap;
}

export function explainLanguageCategory(language: string): string[] {
  const inferred = inferLanguageCategoryExpert(language);
  const winner = inferred.breakdown[0];
  const runnerUp = inferred.breakdown[1];

  return [
    `language=${inferred.normalizedLanguage}`,
    `winner=${winner.category}:${winner.score.toFixed(4)}`,
    `runner-up=${runnerUp.category}:${runnerUp.score.toFixed(4)}`,
    `confidence=${inferred.confidence.toFixed(4)}`,
    ...winner.reasons.slice(0, 4),
  ];
}

export function getSupportedTaxonomyLanguages(): string[] {
  return LANGUAGE_PROFILES.map((profile) => profile.name).sort((a, b) =>
    a.localeCompare(b),
  );
}

export function getLanguageProfilesCount(): number {
  return LANGUAGE_PROFILES.length;
}

export function getTaxonomyProfileSnapshots(): TaxonomyProfileSnapshot[] {
  return LANGUAGE_PROFILES.map((profile) => ({
    name: profile.name,
    aliases: [...profile.aliases],
    ecosystems: [...profile.ecosystems],
    tags: [...profile.tags],
  }));
}

export interface TaxonomyWeightedKeyword {
  token: string;
  category: SkillCategory;
  weight: number;
  reason: string;
}

export function getTaxonomyWeightedKeywords(): TaxonomyWeightedKeyword[] {
  return WEIGHTED_KEYWORDS.map((kw) => ({ ...kw }));
}

export interface TaxonomyRegexRule {
  pattern: RegExp;
  category: SkillCategory;
  weight: number;
  reason: string;
}

export function getTaxonomyRegexRules(): TaxonomyRegexRule[] {
  return REGEX_RULES.map((rule) => ({ ...rule }));
}
