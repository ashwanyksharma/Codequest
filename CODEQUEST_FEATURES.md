# CodeQuest - Gamified DSA Learning Platform

## ✅ Complete Features

### 1. **Multiple Languages Support**
- **JavaScript** - Full execution with real test case validation
- **C++** - Syntax validation with starter templates
- **Python** - Syntax validation with starter templates
- Toggle between languages in the code editor

### 2. **7 Complete Worlds with 28 Problems**

#### World 1: Foundations (5 problems)
- Sum of Two Numbers (Easy)
- Check Even or Odd (Easy)
- FizzBuzz (Easy)
- Factorial (Medium)
- Fibonacci Number (Medium)

#### World 2: C++ Basics (4 problems)
- Maximum of Three (Easy)
- Is Prime (Medium)
- Power Function (Medium)
- GCD of Two Numbers (Medium)

#### World 3: Sorting (4 problems)
- Bubble Sort (Medium)
- Selection Sort (Medium)
- Merge Sort (Hard)
- Sort Colors/Dutch Flag (Hard)

#### World 4: Arrays & Binary Search (4 problems)
- Two Sum (Medium)
- Maximum Subarray (Medium)
- Binary Search (Medium)
- Find Peak Element (Hard)

#### World 5: Strings (5 problems)
- Reverse a String (Easy)
- Is Palindrome (Easy)
- Count Vowels (Easy)
- Valid Anagram (Medium)
- Longest Common Prefix (Medium)

#### World 6: Revision (3 problems)
- Contains Duplicate (Easy)
- Valid Parentheses (Medium)
- Maximum Product Subarray (Hard)

#### World 7: Linked Lists (3 problems)
- Length of Linked List (Easy)
- Reverse Linked List (Medium)
- Merge Two Sorted Lists (Medium)

**Total: 28 problems with 90+ test cases (hidden + visible)**

### 3. **XP & Progression System**
- Earn XP: Easy = 10 XP, Medium = 20 XP, Hard = 40 XP
- Unlock next world after 50% completion of current world
- Level progression: Every 100 XP = 1 level
- Day streak tracking
- Progress bars for each world

### 4. **Gamification Features**
- **10 Unique Badges**
  - First Blood (1st problem solved)
  - Hat Trick (3 problems)
  - XP Hunter (100 XP)
  - Problem Slayer (10 problems)
  - Streak Starter (3-day streak)
  - Week Warrior (7-day streak)
  - XP Legend (500 XP)
  - World Conqueror (Complete a world)
  - Hard Core (5 hard problems)
  - Speed Demon (5 problems in a day)

### 5. **Code Execution & Testing**
- Real-time test case validation
- Detailed test result breakdowns
  - Input/Output comparison
  - Pass/Fail indicators
  - Error messages for syntax/runtime errors
- Hidden test cases (not visible during solving)
- Support for both positive and edge cases

### 6. **Leaderboard**
- Top 50 coders ranked by XP
- Streak display
- Visual progress bars
- Highlighted user's own position

### 7. **User Profile**
- XP summary
- Level display
- Problems solved count
- Day streak counter
- Badge gallery with earned dates
- Account creation date

### 8. **Personal Notes**
- Save personal notes per problem
- Edit anytime
- Quick save functionality

### 9. **AI-Powered Report**
- Weekly performance analysis
- Accuracy calculation
- Error breakdown (wrong answers vs runtime errors)
- Suggestions for improvement
- Gemini integration ready (add `GEMINI_API_KEY` secret to activate)
- Fallback analysis works without API key

### 10. **Problem Details**
Each problem includes:
- Complete problem description
- Multiple examples with inputs/outputs
- Hints section
- Editorial with explanation
- Starter code templates (JS + C++ + Python)
- Difficulty badges
- XP reward display

## 📱 Responsive Design
- Mobile-optimized interface
- Desktop split-view editor
- Mobile bottom sheet for submissions
- Hamburger menu on mobile
- Touch-friendly buttons and interactions

## 🔐 Security Features
- Supabase authentication (email/password)
- Row-level security on all tables
- User data isolation
- Secure submissions tracking

## 🚀 Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth (JWT)
- **Code Execution**: Browser-based JavaScript + C++/Python syntax validation
- **Edge Functions**: Supabase Edge Functions (Gemini AI)
- **Icons**: Lucide React

## 📊 Database Schema
- `profiles` - User info, XP, streaks
- `worlds` - Learning worlds
- `levels` - Levels per world
- `problems` - DSA problems with examples, hints, editorial
- `test_cases` - Input/output validation pairs
- `submissions` - Code submissions with results
- `user_progress` - Per-user problem solving status
- `badges` - Badge definitions
- `user_badges` - Earned badges per user
- `user_notes` - Personal notes per problem

## 🎯 How to Use

### Getting Started
1. Sign up with email and password
2. Create a username
3. Start with World 1: Foundations

### Solving Problems
1. Click a world → select a problem
2. Read the description, examples, and hints
3. Write code in JavaScript or switch to C++/Python
4. Click "Submit" to test against all cases
5. View detailed test results
6. Get instant feedback and earn XP when solved

### Tracking Progress
1. Dashboard shows all worlds and completion %
2. World details show all problems and your attempts
3. Leaderboard ranks you against others
4. Profile shows stats, badges, and levels
5. Weekly report analyzes your performance

## 🎮 Sample Learning Path
1. Start with **Foundations** - basic syntax
2. Move to **C++ Basics** - understand functions
3. Practice **Sorting** - classic algorithms
4. Master **Arrays & Binary Search** - search techniques
5. Explore **Strings** - text manipulation
6. Attempt **Revision** - mixed difficulty
7. Challenge **Linked Lists** - advanced structures

---

**CodeQuest v1.0** - Master DSA, one quest at a time! 🚀
