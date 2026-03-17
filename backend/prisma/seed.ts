import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.aiConversation.deleteMany();
  await prisma.dsaProblem.deleteMany();
  await prisma.userStats.deleteMany();
  await prisma.coreSubject.deleteMany();
  await prisma.rakshakTask.deleteMany();
  await prisma.dailyTask.deleteMany();

  // Seed user's 12 solved DSA problems
  const problems = [
    {
      name: "Two Sum",
      pattern: "HashMap",
      difficulty: "Easy",
      status: "Solved",
      confidence: 3,
      weakPoints: "key/value confusion, HashMap syntax",
      coreIdea: "Use HashMap to store complement (target - num) for O(1) lookup",
      keyLine: "map.put(target - nums[i], i)",
      edgeCase: "Same element used twice, no solution exists",
      timeSpace: "O(n) / O(n)",
      leetcodeNum: 1,
      dateSolved: new Date("2026-03-09"),
    },
    {
      name: "Contains Duplicate",
      pattern: "HashMap",
      difficulty: "Easy",
      status: "Solved",
      confidence: 3,
      weakPoints: "put vs add, HashSet syntax",
      coreIdea: "HashSet tracks seen elements, duplicate = already in set",
      keyLine: "if (!set.add(num)) return true",
      edgeCase: "Empty array, single element",
      timeSpace: "O(n) / O(n)",
      leetcodeNum: 217,
      dateSolved: new Date("2026-03-09"),
    },
    {
      name: "Best Time to Buy & Sell Stock",
      pattern: "Greedy",
      difficulty: "Easy",
      status: "Solved",
      confidence: 5,
      weakPoints: "",
      coreIdea: "Track min price so far, calculate max profit at each step",
      keyLine: "profit = Math.max(profit, price - minPrice)",
      edgeCase: "Decreasing prices, single day",
      timeSpace: "O(n) / O(1)",
      leetcodeNum: 121,
      dateSolved: new Date("2026-03-10"),
    },
    {
      name: "Valid Anagram",
      pattern: "HashMap",
      difficulty: "Easy",
      status: "Solved",
      confidence: 3,
      weakPoints: "final array check, char indexing",
      coreIdea: "Frequency array of 26 chars, increment for s, decrement for t",
      keyLine: "freq[s.charAt(i) - 'a']++",
      edgeCase: "Different lengths, empty strings",
      timeSpace: "O(n) / O(1)",
      leetcodeNum: 242,
      dateSolved: new Date("2026-03-11"),
    },
    {
      name: "Product of Array Except Self",
      pattern: "PrefixSum",
      difficulty: "Medium",
      status: "Solved",
      confidence: 2,
      weakPoints: "implementation unclear, prefix/suffix multiplication",
      coreIdea: "Two passes: left products then right products",
      keyLine: "result[i] = leftProduct; leftProduct *= nums[i]",
      edgeCase: "Contains zero, all zeros, two elements",
      timeSpace: "O(n) / O(1)",
      leetcodeNum: 238,
      dateSolved: new Date("2026-03-12"),
    },
    {
      name: "Longest Substring Without Repeating",
      pattern: "SlidingWindow",
      difficulty: "Medium",
      status: "Solved",
      confidence: 3,
      weakPoints: "duplicate identification, when to shrink window",
      coreIdea: "Expand right, shrink left when duplicate found via Set",
      keyLine: "while (set.has(s[right])) set.delete(s[left++])",
      edgeCase: "All same chars, all unique, empty string",
      timeSpace: "O(n) / O(min(n,26))",
      leetcodeNum: 3,
      dateSolved: new Date("2026-03-13"),
    },
    {
      name: "Minimum Size Subarray Sum",
      pattern: "SlidingWindow",
      difficulty: "Medium",
      status: "Solved",
      confidence: 3,
      weakPoints: ">= vs >, length calculation +1 error",
      coreIdea: "Expand until sum >= target, then shrink to find minimum length",
      keyLine: "while (sum >= target) { minLen = min(minLen, right-left+1); sum -= nums[left++] }",
      edgeCase: "No valid subarray, entire array needed, single element",
      timeSpace: "O(n) / O(1)",
      leetcodeNum: 209,
      dateSolved: new Date("2026-03-14"),
    },
    {
      name: "Valid Parentheses",
      pattern: "Stack",
      difficulty: "Easy",
      status: "Solved",
      confidence: 3,
      weakPoints: "wrong comparison bracket, empty stack check before pop",
      coreIdea: "Push opening brackets, pop and match for closing",
      keyLine: "if (stack.isEmpty() || stack.pop() != map.get(c)) return false",
      edgeCase: "Single bracket, nested brackets, only opening",
      timeSpace: "O(n) / O(n)",
      leetcodeNum: 20,
      dateSolved: new Date("2026-03-14"),
    },
    {
      name: "Next Greater Element I",
      pattern: "Stack",
      difficulty: "Easy",
      status: "Solved",
      confidence: 2,
      weakPoints: "problem understanding, monotonic stack concept",
      coreIdea: "Monotonic decreasing stack to find next greater element",
      keyLine: "while (!stack.isEmpty() && stack.peek() < num) map.put(stack.pop(), num)",
      edgeCase: "Decreasing array (all -1), single element",
      timeSpace: "O(n) / O(n)",
      leetcodeNum: 496,
      dateSolved: new Date("2026-03-15"),
    },
    {
      name: "Top K Frequent Elements",
      pattern: "Heap",
      difficulty: "Medium",
      status: "Solved",
      confidence: 2,
      weakPoints: "heap logic, map iteration, PriorityQueue syntax",
      coreIdea: "Count frequencies with HashMap, use min-heap of size k",
      keyLine: "pq.offer(entry); if (pq.size() > k) pq.poll()",
      edgeCase: "All same frequency, k equals unique elements",
      timeSpace: "O(n log k) / O(n)",
      leetcodeNum: 347,
      dateSolved: new Date("2026-03-16"),
    },
    {
      name: "Subarray Sum Equals K",
      pattern: "PrefixSum",
      difficulty: "Medium",
      status: "Solved",
      confidence: 2,
      weakPoints: "HashMap purpose in prefix sum, frequency counting logic",
      coreIdea: "Prefix sum + HashMap: if prefixSum-k exists in map, found subarray",
      keyLine: "count += map.getOrDefault(sum - k, 0); map.put(sum, map.getOrDefault(sum, 0) + 1)",
      edgeCase: "Negative numbers, k=0, entire array sums to k",
      timeSpace: "O(n) / O(n)",
      leetcodeNum: 560,
      dateSolved: new Date("2026-03-16"),
    },
    {
      name: "Longest Repeating Character Replacement",
      pattern: "SlidingWindow",
      difficulty: "Medium",
      status: "Solved",
      confidence: 2,
      weakPoints: "shrink logic, maxFreq tracking, window size - maxFreq > k",
      coreIdea: "Window valid when (windowSize - maxFreq) <= k replacements",
      keyLine: "if (right - left + 1 - maxFreq > k) { freq[s[left]]--; left++ }",
      edgeCase: "All same char, k=0, k >= string length",
      timeSpace: "O(n) / O(26)",
      leetcodeNum: 424,
      dateSolved: new Date("2026-03-17"),
    },
  ];

  for (const p of problems) {
    await prisma.dsaProblem.create({ data: p });
  }

  // Seed user stats
  await prisma.userStats.create({
    data: {
      id: "main",
      currentStreak: 8,
      longestStreak: 8,
      totalHours: 28,
      weeklyHours: 14,
      lastActiveDate: "2026-03-17",
      startDate: "2026-03-09",
      targetProblems: 300,
    },
  });

  // Seed core subjects
  const subjects = [
    { subject: "OOP", topics: ["Classes & Objects", "Inheritance", "Polymorphism", "Abstraction", "Encapsulation", "SOLID Principles", "Design Patterns"] },
    { subject: "OS", topics: ["Processes & Threads", "CPU Scheduling", "Deadlocks", "Memory Management", "Virtual Memory", "File Systems", "Synchronization"] },
    { subject: "DB", topics: ["SQL Basics", "Normalization", "Indexing", "Transactions", "ACID Properties", "Joins", "Query Optimization"] },
    { subject: "Networks", topics: ["OSI Model", "TCP/IP", "HTTP/HTTPS", "DNS", "Subnetting", "Sockets", "REST APIs"] },
    { subject: "SystemDesign", topics: ["Load Balancing", "Caching", "Database Sharding", "Message Queues", "Microservices", "CAP Theorem", "Rate Limiting"] },
  ];

  for (const s of subjects) {
    for (const topic of s.topics) {
      await prisma.coreSubject.create({
        data: {
          subject: s.subject,
          topic,
          progress: s.subject === "OOP" ? Math.floor(Math.random() * 40) : 0,
        },
      });
    }
  }

  // Seed some Rakshak tasks
  const rakshakTasks = [
    { title: "Set up Spring Boot project", category: "backend", status: "done", priority: 1 },
    { title: "Design REST API endpoints", category: "backend", status: "done", priority: 2 },
    { title: "Implement user authentication", category: "backend", status: "in_progress", priority: 3 },
    { title: "Set up Android project with Kotlin", category: "android", status: "todo", priority: 1 },
    { title: "Design app wireframes", category: "android", status: "todo", priority: 2 },
    { title: "System architecture diagram", category: "architecture", status: "done", priority: 1 },
    { title: "API documentation", category: "docs", status: "in_progress", priority: 1 },
    { title: "Database schema design", category: "architecture", status: "done", priority: 2 },
  ];

  for (const t of rakshakTasks) {
    await prisma.rakshakTask.create({ data: t });
  }

  // Seed today's daily tasks
  const today = "2026-03-17";
  const dailyTasks = [
    { date: today, type: "dsa_new", title: "Solve 2 new Sliding Window problems", priority: 1 },
    { date: today, type: "dsa_revision", title: "Review Subarray Sum Equals K (weak: HashMap purpose)", priority: 2 },
    { date: today, type: "project", title: "Implement user authentication for Rakshak", priority: 3 },
    { date: today, type: "core_subjects", title: "Study OS: Processes & Threads (30 min)", priority: 4 },
  ];

  for (const t of dailyTasks) {
    await prisma.dailyTask.create({ data: t });
  }

  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
