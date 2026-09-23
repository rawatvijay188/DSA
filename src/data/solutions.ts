export interface Solution { t: string; s: string; c: string; }

export const SOL: Record<string, Solution> = {
// ── DAY 1: Arrays I ──
'd1:p0':{t:'O(n)',s:'O(1)',c:`// Boyer-Moore Voting Algorithm
function majorityElement(nums) {
  let candidate = nums[0], count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) { candidate = nums[i]; count = 1; }
    else if (nums[i] === candidate) count++;
    else count--;
  }
  return candidate;
}`},
'd1:p1':{t:'O(n)',s:'O(1)',c:`// XOR approach: n^(n-1) gives repeat-related bits
function findRepeatAndMissing(arr) {
  const n = arr.length;
  let xor = 0;
  for (let i = 0; i < n; i++) xor ^= arr[i] ^ (i + 1);
  const bit = xor & (-xor);
  let x = 0, y = 0;
  for (let i = 0; i < n; i++) {
    if (arr[i] & bit) x ^= arr[i]; else y ^= arr[i];
    if ((i + 1) & bit) x ^= (i + 1); else y ^= (i + 1);
  }
  for (const v of arr) if (v === x) return [x, y];
  return [y, x];
}`},
'd1:p2':{t:'O((m+n)log(m+n))',s:'O(1)',c:`// Gap method - merge without extra space
function merge(arr1, m, arr2, n) {
  let gap = Math.ceil((m + n) / 2);
  while (gap > 0) {
    for (let i = 0; i + gap < m + n; i++) {
      const j = i + gap;
      const a = i < m ? arr1[i] : arr2[i - m];
      const b = j < m ? arr1[j] : arr2[j - m];
      if (a > b) {
        if (i < m && j < m) [arr1[i], arr1[j]] = [arr1[j], arr1[i]];
        else if (i < m) { arr1[i] = b; arr2[j - m] = a; }
        else [arr2[i - m], arr2[j - m]] = [arr2[j - m], arr2[i - m]];
      }
    }
    gap = gap === 1 ? 0 : Math.ceil(gap / 2);
  }
}`},
'd1:p3':{t:'O(n)',s:'O(1)',c:`// XOR cancels duplicates; single number remains
function singleNumber(nums) {
  return nums.reduce((acc, n) => acc ^ n, 0);
}`},
'd1:p4':{t:'O(n)',s:'O(1)',c:`// Track running minimum; maximize profit in one pass
function maxProfit(prices) {
  let minPrice = Infinity, maxProfit = 0;
  for (const p of prices) {
    minPrice = Math.min(minPrice, p);
    maxProfit = Math.max(maxProfit, p - minPrice);
  }
  return maxProfit;
}`},
'd1:p5':{t:'O(log n)',s:'O(1)',c:`// Fast exponentiation (binary exponentiation)
function myPow(x, n) {
  if (n < 0) { x = 1 / x; n = -n; }
  let result = 1;
  while (n > 0) {
    if (n % 2 === 1) result *= x;
    x *= x;
    n = Math.floor(n / 2);
  }
  return result;
}`},
// ── DAY 2: Arrays II ──
'd2:p0':{t:'O(n)',s:'O(1)',c:`// Kadane's algorithm: track current and global max
function maxSubArray(nums) {
  let cur = nums[0], best = nums[0];
  for (let i = 1; i < nums.length; i++) {
    cur = Math.max(nums[i], cur + nums[i]);
    best = Math.max(best, cur);
  }
  return best;
}`},
'd2:p1':{t:'O(log(m*n))',s:'O(1)',c:`// Treat 2D matrix as 1D sorted array
function searchMatrix(matrix, target) {
  const m = matrix.length, n = matrix[0].length;
  let lo = 0, hi = m * n - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const val = matrix[Math.floor(mid / n)][mid % n];
    if (val === target) return true;
    else if (val < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}`},
'd2:p2':{t:'O(n)',s:'O(1)',c:`// Two pointers shrink from both ends
function maxArea(height) {
  let l = 0, r = height.length - 1, best = 0;
  while (l < r) {
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    if (height[l] < height[r]) l++; else r--;
  }
  return best;
}`},
'd2:p3':{t:'O(n)',s:'O(1)',c:`// Dutch National Flag: three pointers
function sortColors(nums) {
  let lo = 0, mid = 0, hi = nums.length - 1;
  while (mid <= hi) {
    if (nums[mid] === 0) { [nums[lo], nums[mid]] = [nums[mid], nums[lo]]; lo++; mid++; }
    else if (nums[mid] === 1) mid++;
    else { [nums[mid], nums[hi]] = [nums[hi], nums[mid]]; hi--; }
  }
}`},
'd2:p4':{t:'O(n²)',s:'O(1)',c:`// Sort + two pointers to avoid duplicates
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const res = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let l = i + 1, r = nums.length - 1;
    while (l < r) {
      const s = nums[i] + nums[l] + nums[r];
      if (s === 0) {
        res.push([nums[i], nums[l], nums[r]]);
        while (l < r && nums[l] === nums[l+1]) l++;
        while (l < r && nums[r] === nums[r-1]) r--;
        l++; r--;
      } else if (s < 0) l++; else r--;
    }
  }
  return res;
}`},
'd2:p5':{t:'O(n³)',s:'O(1)',c:`// Sort + fix two elements + two pointers
function fourSum(nums, target) {
  nums.sort((a, b) => a - b);
  const res = [], n = nums.length;
  for (let i = 0; i < n - 3; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue;
    for (let j = i+1; j < n - 2; j++) {
      if (j > i+1 && nums[j] === nums[j-1]) continue;
      let l = j+1, r = n-1;
      while (l < r) {
        const s = nums[i]+nums[j]+nums[l]+nums[r];
        if (s === target) {
          res.push([nums[i],nums[j],nums[l],nums[r]]);
          while(l<r&&nums[l]===nums[l+1])l++;
          while(l<r&&nums[r]===nums[r-1])r--;
          l++; r--;
        } else if (s < target) l++; else r--;
      }
    }
  }
  return res;
}`},
// ── DAY 3: Arrays III ──
'd3:p0':{t:'O(n)',s:'O(1)',c:`// Find rightmost descent, swap with next larger, reverse suffix
function nextPermutation(nums) {
  const n = nums.length;
  let i = n - 2;
  while (i >= 0 && nums[i] >= nums[i+1]) i--;
  if (i >= 0) {
    let j = n - 1;
    while (nums[j] <= nums[i]) j--;
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  let l = i+1, r = n-1;
  while (l < r) { [nums[l], nums[r]] = [nums[r], nums[l]]; l++; r--; }
}`},
'd3:p1':{t:'O(n log n)',s:'O(n)',c:`// Sort by start, merge overlapping intervals
function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const res = [intervals[0]];
  for (const [s, e] of intervals.slice(1)) {
    const last = res[res.length - 1];
    if (s <= last[1]) last[1] = Math.max(last[1], e);
    else res.push([s, e]);
  }
  return res;
}`},
'd3:p2':{t:'O(n)',s:'O(min(n,k))',c:`// Sliding window with hash map
function lengthOfLongestSubstring(s) {
  const map = new Map();
  let max = 0, l = 0;
  for (let r = 0; r < s.length; r++) {
    if (map.has(s[r]) && map.get(s[r]) >= l) l = map.get(s[r]) + 1;
    map.set(s[r], r);
    max = Math.max(max, r - l + 1);
  }
  return max;
}`},
'd3:p3':{t:'O(m*n)',s:'O(1)',c:`// Two passes: mark rows/cols with 0s, then zero out
function setZeroes(matrix) {
  const m = matrix.length, n = matrix[0].length;
  let firstRowZero = matrix[0].includes(0), firstColZero = matrix.some(r => r[0] === 0);
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][j] === 0) { matrix[i][0] = 0; matrix[0][j] = 0; }
  for (let i = 1; i < m; i++)
    for (let j = 1; j < n; j++)
      if (matrix[i][0] === 0 || matrix[0][j] === 0) matrix[i][j] = 0;
  if (firstRowZero) matrix[0].fill(0);
  if (firstColZero) for (let i = 0; i < m; i++) matrix[i][0] = 0;
}`},
'd3:p4':{t:'O(m*n*4^L)',s:'O(L)',c:`// DFS backtracking on grid
function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(i, j, k) {
    if (k === word.length) return true;
    if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
    const tmp = board[i][j]; board[i][j] = '#';
    const found = dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);
    board[i][j] = tmp;
    return found;
  }
  for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i,j,0)) return true;
  return false;
}`},
'd3:p5':{t:'O(n)',s:'O(n)',c:`// Prefix product from left and right, multiply together
function productExceptSelf(nums) {
  const n = nums.length, res = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) { res[i] = left; left *= nums[i]; }
  let right = 1;
  for (let i = n-1; i >= 0; i--) { res[i] *= right; right *= nums[i]; }
  return res;
}`},
// ── DAY 4: Arrays IV ──
'd4:p0':{t:'O(n)',s:'O(n)',c:`// Prefix sum + hash map: count subarrays summing to k
function subarraySum(nums, k) {
  const map = new Map([[0, 1]]);
  let count = 0, prefix = 0;
  for (const n of nums) {
    prefix += n;
    count += (map.get(prefix - k) || 0);
    map.set(prefix, (map.get(prefix) || 0) + 1);
  }
  return count;
}`},
'd4:p1':{t:'O(n)',s:'O(1)',c:`// Floyd's cycle detection (fast/slow pointers)
function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do { slow = nums[slow]; fast = nums[nums[fast]]; } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) { slow = nums[slow]; fast = nums[fast]; }
  return slow;
}`},
'd4:p2':{t:'O(m*n)',s:'O(1)',c:`// Simulate four boundaries shrinking inward
function spiralOrder(matrix) {
  const res = [];
  let top = 0, bottom = matrix.length-1, left = 0, right = matrix[0].length-1;
  while (top <= bottom && left <= right) {
    for (let i = left; i <= right; i++) res.push(matrix[top][i]); top++;
    for (let i = top; i <= bottom; i++) res.push(matrix[i][right]); right--;
    if (top <= bottom) { for (let i = right; i >= left; i--) res.push(matrix[bottom][i]); bottom--; }
    if (left <= right) { for (let i = bottom; i >= top; i--) res.push(matrix[i][left]); left++; }
  }
  return res;
}`},
'd4:p3':{t:'O(m+n)',s:'O(1)',c:`// Start top-right: move left if too big, down if too small
function searchMatrix(matrix, target) {
  let r = 0, c = matrix[0].length - 1;
  while (r < matrix.length && c >= 0) {
    if (matrix[r][c] === target) return true;
    else if (matrix[r][c] > target) c--;
    else r++;
  }
  return false;
}`},
'd4:p4':{t:'O(n log n)',s:'O(n)',c:`// Modified merge sort counts split inversions
function countInversions(arr) {
  let count = 0;
  function mergeSort(a) {
    if (a.length <= 1) return a;
    const mid = Math.floor(a.length / 2);
    const left = mergeSort(a.slice(0, mid)), right = mergeSort(a.slice(mid));
    const merged = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) merged.push(left[i++]);
      else { count += left.length - i; merged.push(right[j++]); }
    }
    return merged.concat(left.slice(i), right.slice(j));
  }
  mergeSort(arr);
  return count;
}`},
// ── DAY 5: Arrays V ──
'd5:p0':{t:'O(n)',s:'O(1)',c:`// Two pointers track max from left and right
function trap(height) {
  let l = 0, r = height.length - 1, lMax = 0, rMax = 0, water = 0;
  while (l < r) {
    if (height[l] < height[r]) { lMax = Math.max(lMax, height[l]); water += lMax - height[l]; l++; }
    else { rMax = Math.max(rMax, height[r]); water += rMax - height[r]; r--; }
  }
  return water;
}`},
'd5:p1':{t:'O(n)',s:'O(k)',c:`// Monotonic deque maintains window max
function maxSlidingWindow(nums, k) {
  const res = [], dq = [];
  for (let i = 0; i < nums.length; i++) {
    while (dq.length && dq[0] < i - k + 1) dq.shift();
    while (dq.length && nums[dq[dq.length-1]] < nums[i]) dq.pop();
    dq.push(i);
    if (i >= k - 1) res.push(nums[dq[0]]);
  }
  return res;
}`},
'd5:p2':{t:'O(n log n)',s:'O(n)',c:`// Modified merge sort counts reverse pairs (i<j, arr[i]>2*arr[j])
function reversePairs(nums) {
  let count = 0;
  function merge(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = merge(arr.slice(0, mid)), right = merge(arr.slice(mid));
    let j = 0;
    for (const l of left) { while (j < right.length && l > 2 * right[j]) j++; count += j; }
    const res = []; let i = 0; j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) res.push(left[i++]); else res.push(right[j++]);
    }
    return res.concat(left.slice(i), right.slice(j));
  }
  merge(nums);
  return count;
}`},
'd5:p3':{t:'O(n)',s:'O(n)',c:`// Monotonic stack: find next smaller element boundaries
function largestRectangleArea(heights) {
  const stack = [], n = heights.length;
  let max = 0;
  for (let i = 0; i <= n; i++) {
    const h = i === n ? 0 : heights[i];
    while (stack.length && heights[stack[stack.length-1]] > h) {
      const height = heights[stack.pop()];
      const width = stack.length ? i - stack[stack.length-1] - 1 : i;
      max = Math.max(max, height * width);
    }
    stack.push(i);
  }
  return max;
}`},
};
