export interface Topic {
  id: string;
  name: string;
  days: string;
  color: string;
}

export interface Day {
  n: number;
  title: string;
  topic: string;
  color: string;
  problems: string[];
}

export const TOPICS: Topic[] = [
  { id: 'arrays',  name: 'Arrays',                   days: '1–5',   color: '#58A6FF' },
  { id: 'strings', name: 'Strings',                  days: '6–7',   color: '#BC8CFF' },
  { id: 'bsearch', name: 'Binary Search',            days: '8',     color: '#3FB950' },
  { id: 'recur',   name: 'Recursion & Backtracking', days: '9–10',  color: '#F85149' },
  { id: 'll',      name: 'Linked List',              days: '11–12', color: '#E3B341' },
  { id: 'stackq',  name: 'Stacks & Queues',          days: '13–15', color: '#FFA657' },
  { id: 'btree',   name: 'Binary Trees',             days: '16–19', color: '#79C0FF' },
  { id: 'bst',     name: 'BST',                      days: '20–22', color: '#56D364' },
  { id: 'heaps',   name: 'Heaps',                    days: '23',    color: '#FF7B72' },
  { id: 'tries',   name: 'Tries',                    days: '24',    color: '#C3E88D' },
  { id: 'graphs',  name: 'Graphs',                   days: '25–28', color: '#89DDFF' },
  { id: 'dp',      name: 'Dynamic Programming',      days: '29–32', color: '#FFCB6B' },
  { id: 'greedy',  name: 'Greedy',                   days: '33',    color: '#F78C6C' },
  { id: 'misc',    name: 'Miscellaneous',            days: '34',    color: '#9E9E9E' },
];

export const DAYS: Day[] = [
  { n: 1,  title: 'Arrays I',                  topic: 'arrays',  color: '#58A6FF', problems: ['Majority Element','Repeat & Missing Number','Merge 2 Sorted Arrays','Single Number','Stock Buy & Sell','Pow(x,n)'] },
  { n: 2,  title: 'Arrays II',                 topic: 'arrays',  color: '#58A6FF', problems: ["Kadane's Algorithm",'Search in 2D Matrix','Container With Most Water','Sort Array of 0s 1s 2s','3Sum','4Sum'] },
  { n: 3,  title: 'Arrays III',                topic: 'arrays',  color: '#58A6FF', problems: ['Next Permutation','Merge Overlapping Intervals','Longest Substring Without Repeating Chars','Set Matrix Zeroes','Word Search','Product of Array Except Self'] },
  { n: 4,  title: 'Arrays IV',                 topic: 'arrays',  color: '#58A6FF', problems: ['Subarray Sum Equals K','Find Duplicate Number','Spiral Matrix','Search in Sorted Matrix II','Count Inversions'] },
  { n: 5,  title: 'Arrays V',                  topic: 'arrays',  color: '#58A6FF', problems: ['Trapping Rain Water','Sliding Window Maximum','Reverse Pairs','Largest Rectangle in Histogram'] },
  { n: 6,  title: 'Strings I',                 topic: 'strings', color: '#BC8CFF', problems: ['Valid Palindrome','Valid Anagram','Reverse Words in String','Remove All Occurrences','Permutation in String','String Compression'] },
  { n: 7,  title: 'Strings II',                topic: 'strings', color: '#BC8CFF', problems: ['Reverse Words in String II','Longest Common Prefix','Group Anagrams','Minimum Window Substring','KMP Algorithm','Rabin-Karp Algorithm'] },
  { n: 8,  title: 'Binary Search',             topic: 'bsearch', color: '#3FB950', problems: ['Peak Index in Mountain Array','Search in Rotated Sorted Array','Single Element in Sorted Array','Aggressive Cows','Allocate Minimum Pages',"Painter's Partition",'Split Array Largest Sum'] },
  { n: 9,  title: 'Recursion & Backtracking I',topic: 'recur',   color: '#F85149', problems: ['Subsets','Subsets II','Combination Sum','Combination Sum II','Permutations','Permutations II'] },
  { n: 10, title: 'Recursion & Backtracking II',topic:'recur',   color: '#F85149', problems: ['N Queens','Sudoku Solver','Rat in a Maze','Word Break','Palindrome Partitioning'] },
  { n: 11, title: 'Linked List I',             topic: 'll',      color: '#E3B341', problems: ['Reverse Linked List','Middle of Linked List','Linked List Cycle','Palindrome Linked List','Remove Nth Node From End','Merge Two Sorted Lists'] },
  { n: 12, title: 'Linked List II',            topic: 'll',      color: '#E3B341', problems: ['Add Two Numbers','Intersection of Linked Lists','Flatten Linked List','Copy List With Random Pointer','Reverse Nodes in K Group','Rotate Linked List'] },
  { n: 13, title: 'Stacks & Queues I',         topic: 'stackq',  color: '#FFA657', problems: ['Valid Parentheses','Implement Stack Using Queue','Implement Queue Using Stack','Min Stack','Next Greater Element','Next Smaller Element'] },
  { n: 14, title: 'Stacks & Queues II',        topic: 'stackq',  color: '#FFA657', problems: ['Largest Rectangle in Histogram','Stock Span Problem','Sliding Window Maximum','Celebrity Problem','Rotten Oranges'] },
  { n: 15, title: 'Stacks & Queues III',       topic: 'stackq',  color: '#FFA657', problems: ['LRU Cache','LFU Cache','Circular Queue','Deque Implementation','First Non-Repeating Char in Stream'] },
  { n: 16, title: 'Binary Trees I',            topic: 'btree',   color: '#79C0FF', problems: ['Preorder Traversal','Inorder Traversal','Postorder Traversal','Level Order Traversal','Maximum Depth','Balanced Binary Tree'] },
  { n: 17, title: 'Binary Trees II',           topic: 'btree',   color: '#79C0FF', problems: ['Diameter of Binary Tree','Maximum Path Sum','Identical Trees','Zigzag Traversal','Boundary Traversal','Vertical Order Traversal'] },
  { n: 18, title: 'Binary Trees III',          topic: 'btree',   color: '#79C0FF', problems: ['Top View','Bottom View','Left View','Right View','Symmetric Tree','Lowest Common Ancestor'] },
  { n: 19, title: 'Binary Trees IV',           topic: 'btree',   color: '#79C0FF', problems: ['Children Sum Property','Flatten Binary Tree','Serialize Binary Tree','Deserialize Binary Tree','Morris Traversal','Construct Tree From Traversals'] },
  { n: 20, title: 'BST I',                     topic: 'bst',     color: '#56D364', problems: ['Search in BST','Insert into BST','Delete Node in BST','Ceil in BST','Floor in BST'] },
  { n: 21, title: 'BST II',                    topic: 'bst',     color: '#56D364', problems: ['Validate BST','Kth Smallest Element','BST Iterator','LCA in BST','Construct BST From Preorder'] },
  { n: 22, title: 'BST III',                   topic: 'bst',     color: '#56D364', problems: ['Recover BST','Largest BST in Binary Tree','Two Sum in BST','Inorder Successor','Inorder Predecessor'] },
  { n: 23, title: 'Heaps',                     topic: 'heaps',   color: '#FF7B72', problems: ['Heap Implementation','Kth Largest Element','Kth Smallest Element','Merge K Sorted Arrays','Merge K Sorted Lists','Find Median From Data Stream'] },
  { n: 24, title: 'Tries',                     topic: 'tries',   color: '#C3E88D', problems: ['Implement Trie','Implement Trie II','Complete String','Maximum XOR of Two Numbers','Search Suggestion System'] },
  { n: 25, title: 'Graphs I',                  topic: 'graphs',  color: '#89DDFF', problems: ['BFS Traversal','DFS Traversal','Number of Islands','Flood Fill','Rotten Oranges','Cycle Detection Undirected'] },
  { n: 26, title: 'Graphs II',                 topic: 'graphs',  color: '#89DDFF', problems: ['Bipartite Graph','Topological Sort','Course Schedule','Detect Cycle in Directed Graph','Eventual Safe States','Alien Dictionary'] },
  { n: 27, title: 'Graphs III',                topic: 'graphs',  color: '#89DDFF', problems: ['Dijkstra Algorithm','Shortest Path in DAG','Bellman Ford','Floyd Warshall','Network Delay Time','Cheapest Flights Within K Stops','Path With Minimum Effort'] },
  { n: 28, title: 'Graphs IV',                 topic: 'graphs',  color: '#89DDFF', problems: ['Disjoint Set Union','Kruskal Algorithm','Prim Algorithm','Number of Provinces','Accounts Merge','Making A Large Island','Strongly Connected Components'] },
  { n: 29, title: 'DP I',                      topic: 'dp',      color: '#FFCB6B', problems: ['Fibonacci','Climbing Stairs','Frog Jump','House Robber','Ninja Training'] },
  { n: 30, title: 'DP II',                     topic: 'dp',      color: '#FFCB6B', problems: ['0/1 Knapsack','Unbounded Knapsack','Coin Change','Target Sum','Partition Equal Subset Sum','Minimum Subset Difference'] },
  { n: 31, title: 'DP III',                    topic: 'dp',      color: '#FFCB6B', problems: ['Longest Common Subsequence','Longest Common Substring','Shortest Common Supersequence','Edit Distance','Distinct Subsequences'] },
  { n: 32, title: 'DP IV',                     topic: 'dp',      color: '#FFCB6B', problems: ['Longest Increasing Subsequence','Matrix Chain Multiplication','Burst Balloons','Palindrome Partitioning II','Best Time to Buy & Sell Stock Series'] },
  { n: 33, title: 'Greedy',                    topic: 'greedy',  color: '#F78C6C', problems: ['Activity Selection','Fractional Knapsack','Job Sequencing Problem','Minimum Platforms','Huffman Encoding','Candy Distribution'] },
  { n: 34, title: 'Miscellaneous',             topic: 'misc',    color: '#9E9E9E', problems: ['Power of Two','Count Set Bits','Single Number Variants','Sieve of Eratosthenes','Interview Puzzle / Mixed DSA'] },
];

export const TOTAL = DAYS.reduce((s, d) => s + d.problems.length, 0);

export function pid(day: number, pi: number): string {
  return `d${day}:p${pi}`;
}

export function getTopicDays(topicId: string): Day[] {
  return DAYS.filter(d => d.topic === topicId);
}

export function getTopicTotal(topicId: string): number {
  return getTopicDays(topicId).reduce((s, d) => s + d.problems.length, 0);
}
