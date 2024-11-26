const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Phonebook', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3001')
  })

  test('front page can be opened', async ({ page }) => {
    const body = page.locator('body')

    await expect(body).toContainText('Phonebook')
    await expect(body).toContainText('add a new')
    await expect(body).toContainText('Numbers')
  })
})
