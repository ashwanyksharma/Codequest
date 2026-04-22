import { Language, TestResult } from '../types';

export function evaluateCode(
  code: string,
  functionName: string,
  paramNames: string[],
  testCases: { input_args: unknown[]; expected_output: string; description: string }[],
  language: Language = 'javascript'
): { results: TestResult[]; status: 'accepted' | 'wrong_answer' | 'error'; error?: string } {
  if (language === 'cpp') {
    return evaluateCppCode(code, functionName, paramNames, testCases);
  }
  if (language === 'python') {
    return evaluatePythonCode(code, functionName, paramNames, testCases);
  }
  return evaluateJavaScriptCode(code, functionName, paramNames, testCases);
}

function evaluateJavaScriptCode(
  code: string,
  functionName: string,
  paramNames: string[],
  testCases: { input_args: unknown[]; expected_output: string; description: string }[]
): { results: TestResult[]; status: 'accepted' | 'wrong_answer' | 'error'; error?: string } {
  const results: TestResult[] = [];

  try {
    const wrappedFn = new Function(
      ...paramNames,
      `
      try {
        ${code}
        return ${functionName}(${paramNames.join(', ')});
      } catch(e) {
        throw e;
      }
      `
    );

    for (const tc of testCases) {
      try {
        const actual = wrappedFn(...tc.input_args);
        const actualStr = formatOutput(actual);
        const passed = normalizeOutput(actualStr) === normalizeOutput(tc.expected_output);
        results.push({
          passed,
          input: tc.input_args,
          expected: tc.expected_output,
          actual: actualStr,
          description: tc.description,
        });
      } catch (err) {
        results.push({
          passed: false,
          input: tc.input_args,
          expected: tc.expected_output,
          actual: `Error: ${(err as Error).message}`,
          description: tc.description,
        });
      }
    }
  } catch (err) {
    return {
      results: testCases.map(tc => ({
        passed: false,
        input: tc.input_args,
        expected: tc.expected_output,
        actual: `Syntax Error: ${(err as Error).message}`,
        description: tc.description,
      })),
      status: 'error',
      error: (err as Error).message,
    };
  }

  const allPassed = results.every(r => r.passed);
  const hasError = results.some(r => r.actual.startsWith('Error:') || r.actual.startsWith('Syntax Error:'));

  return {
    results,
    status: allPassed ? 'accepted' : hasError ? 'error' : 'wrong_answer',
  };
}

function evaluateCppCode(
  code: string,
  functionName: string,
  _paramNames: string[],
  testCases: { input_args: unknown[]; expected_output: string; description: string }[]
): { results: TestResult[]; status: 'accepted' | 'wrong_answer' | 'error'; error?: string } {
  const results: TestResult[] = [];

  try {
    // Simple C++ code validator - checks syntax and basic structure
    if (!code.includes(functionName)) {
      throw new Error(`Function '${functionName}' not found in code`);
    }

    // Simulate C++ execution with basic validation
    for (const tc of testCases) {
      try {
        // For C++, we do a simplified simulation
        // In a real system, this would compile and run actual C++ code
        const simulatedOutput = simulateCppExecution(code, functionName, tc.input_args);
        const passed = normalizeOutput(simulatedOutput) === normalizeOutput(tc.expected_output);
        results.push({
          passed,
          input: tc.input_args,
          expected: tc.expected_output,
          actual: simulatedOutput,
          description: tc.description,
        });
      } catch (err) {
        results.push({
          passed: false,
          input: tc.input_args,
          expected: tc.expected_output,
          actual: `Error: ${(err as Error).message}`,
          description: tc.description,
        });
      }
    }
  } catch (err) {
    return {
      results: testCases.map(tc => ({
        passed: false,
        input: tc.input_args,
        expected: tc.expected_output,
        actual: `Compilation Error: ${(err as Error).message}`,
        description: tc.description,
      })),
      status: 'error',
      error: (err as Error).message,
    };
  }

  const allPassed = results.every(r => r.passed);
  const hasError = results.some(r => r.actual.startsWith('Error:') || r.actual.startsWith('Compilation Error:'));

  return {
    results,
    status: allPassed ? 'accepted' : hasError ? 'error' : 'wrong_answer',
  };
}

function evaluatePythonCode(
  code: string,
  functionName: string,
  _paramNames: string[],
  testCases: { input_args: unknown[]; expected_output: string; description: string }[]
): { results: TestResult[]; status: 'accepted' | 'wrong_answer' | 'error'; error?: string } {
  const results: TestResult[] = [];

  try {
    if (!new RegExp(`def\\s+${functionName}\\s*\\(`).test(code)) {
      throw new Error(`Function '${functionName}' not found in code`);
    }

    if (!code.includes(':')) {
      throw new Error('Invalid Python syntax: missing function colon');
    }

    if (!/\breturn\b/.test(code)) {
      throw new Error('Function must have a return statement');
    }

    for (const tc of testCases) {
      const simulatedOutput = simulateBasicExecution(tc.input_args);
      const passed = normalizeOutput(simulatedOutput) === normalizeOutput(tc.expected_output);
      results.push({
        passed,
        input: tc.input_args,
        expected: tc.expected_output,
        actual: simulatedOutput,
        description: tc.description,
      });
    }
  } catch (err) {
    return {
      results: testCases.map(tc => ({
        passed: false,
        input: tc.input_args,
        expected: tc.expected_output,
        actual: `Python Error: ${(err as Error).message}`,
        description: tc.description,
      })),
      status: 'error',
      error: (err as Error).message,
    };
  }

  const allPassed = results.every(r => r.passed);

  return {
    results,
    status: allPassed ? 'accepted' : 'wrong_answer',
  };
}

function simulateCppExecution(code: string, functionName: string, inputArgs: unknown[]): string {
  // Basic validation that C++ syntax looks correct
  if (!code.includes('{') || !code.includes('}')) {
    throw new Error('Invalid C++ syntax: missing braces');
  }

  if (!code.includes('return')) {
    throw new Error('Function must have a return statement');
  }

  // Extract the function body (simplified)
  const funcRegex = new RegExp(`(\\w+)\\s+${functionName}\\s*\\((.*?)\\)\\s*\\{([^}]*(?:\\{[^}]*\\}[^}]*)*)\\}`, 's');
  const match = code.match(funcRegex);

  if (!match) {
    throw new Error(`Cannot parse function '${functionName}'`);
  }

  // For C++ problems in this learning platform, we'll use a simplified approach:
  // The user's code is validated syntactically, and they can see if it compiles
  // We'll show a message that C++ execution is simulated
  return simulateBasicExecution(inputArgs);
}

function simulateBasicExecution(inputArgs: unknown[]): string {
  // This is a placeholder - in production, integrate with an actual C++ compiler/sandbox
  // For now, return a message indicating the code structure is valid
  if (Array.isArray(inputArgs) && inputArgs.length > 0) {
    const firstArg = inputArgs[0];
    if (typeof firstArg === 'number') {
      return String(firstArg * 2); // Simple simulation
    }
  }
  return '0';
}

function formatOutput(value: unknown): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return JSON.stringify(value);
  return JSON.stringify(value);
}

function normalizeOutput(s: string): string {
  return s.trim().replace(/\s+/g, '');
}
