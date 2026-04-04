# Testing Guide

## Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm test:watch
```

### Generate Coverage Report
```bash
npm test:cov
```

## Running Specific Tests

### Run Bot Tests Only
```bash
npm test -- src/bot/bot.update.spec.ts --no-watch
```

### Run Solana Service Tests Only
```bash
npm test -- src/solana/solana.service.spec.ts --no-watch
```

### Run Single Test
```bash
npm test -- --testNamePattern="should add wallet when address provided"
```

### Run with Verbose Output
```bash
npm test -- --verbose
```

## Test Files

### Bot Update Tests (`src/bot/bot.update.spec.ts`)
Tests all Telegram bot command handlers and callbacks.

**Coverage:**
- 14 commands
- 16 callbacks
- Error handling
- Chain detection
- Text message handlers

### Solana Service Tests (`src/solana/solana.service.spec.ts`)
Tests all Solana blockchain operations and data retrieval.

**Coverage:**
- Wallet operations
- Chain detection
- Portfolio and transactions
- Token prices and PnL
- Error handling

## Test Structure

Each test follows the Arrange-Act-Assert pattern:

```typescript
describe('Feature', () => {
  it('should do something', async () => {
    // Arrange - Setup
    mockService.method.mockResolvedValue(data);
    
    // Act - Execute
    const result = await service.method();
    
    // Assert - Verify
    expect(result).toBe(expected);
  });
});
```

## Mocking Strategy

### Bot Tests
- **SolanaService**: All methods mocked to test bot logic in isolation
- **Telegram Context**: Mocked with reply, editMessageText, answerCbQuery methods
- **Telegram API**: Mocked sendMessage for notifications

### Solana Service Tests
- **PrismaService**: All database operations mocked
- **ConfigService**: Configuration values mocked
- **External APIs**: Helius, Jupiter, CoinGecko APIs mocked

## Common Test Patterns

### Testing Commands
```typescript
it('should handle /command', async () => {
  mockCtx.message = { text: '/command arg' };
  await botUpdate.onCommand(mockCtx);
  expect(mockCtx.reply).toHaveBeenCalled();
});
```

### Testing Error Scenarios
```typescript
it('should handle error', async () => {
  service.method.mockRejectedValue(new Error('error'));
  const result = await service.method();
  expect(result).toBe(false);
});
```

### Testing Chain Detection
```typescript
it('should detect chain', () => {
  const result = service.detectChain('address');
  expect(result).toBe('chain_type');
});
```

## Debugging Tests

### Run Single Test with Debugger
```bash
npm test -- --testNamePattern="test name" --verbose
```

### Debug in VS Code
Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Jest Debug",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": ["--runInBand"],
  "console": "integratedTerminal"
}
```

Then press F5 to start debugging.

## Coverage Report

After running `npm test:cov`, open the coverage report:

```bash
open coverage/lcov-report/index.html
```

This shows:
- Line coverage
- Branch coverage
- Function coverage
- Statement coverage

## Best Practices

1. **Isolation**: Each test is independent
2. **Clarity**: Test names clearly describe what's being tested
3. **Coverage**: Both success and failure paths tested
4. **Mocking**: External dependencies fully mocked
5. **Assertions**: Multiple assertions verify complete behavior

## Troubleshooting

### Tests Timeout
Increase timeout in jest.config.js:
```javascript
testTimeout: 10000
```

### Mock Not Working
Ensure mock is set up before calling the method:
```typescript
beforeEach(() => {
  // Setup mocks here
});
```

### Coverage Not Generated
Run with coverage flag:
```bash
npm test:cov
```

## Adding New Tests

When adding new functionality:

1. Write test first (TDD approach)
2. Implement the feature
3. Verify test passes
4. Check coverage remains >95%

Example:

```typescript
describe('New Feature', () => {
  it('should do something', async () => {
    // Setup
    // Execute
    // Assert
  });
});
```

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```bash
npm test -- --no-watch --coverage
```

This will:
- Run all tests once
- Generate coverage report
- Exit with appropriate status code

## Resources

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Telegraf Testing](https://telegraf.js.org/)
- [Solana Web3.js](https://solana-labs.github.io/solana-web3.js/)

## Support

For issues or questions:

1. Check existing test examples
2. Review TEST_COVERAGE.md for detailed coverage
3. Run tests with verbose output
4. Check test output for specific error messages
