import { expect, test } from '@playwright/test'

test('loads statistics for a day with no data', async ({ page }) => {
    await page.goto('/statistics?day=2024-10-12')
    await expect(page.getByText('no data for 2024-10-12')).toHaveCount(1)
})

test('pressing apply on initial render fetches with DEFAULT_DATE', async ({ page }) => {
    await page.goto('/statistics')
    // datepicker has a DEFAULT_DATE set on initial render
    // pressing "apply" should trigger fetch right away
    await page.getByRole('button', { name: /apply/i }).click()
    await expect(page).toHaveURL(/\/statistics\?day=2024-01-01/)
    await expect(page.locator('table')).toBeVisible()
})

test('paging changes the day', async ({ page }) => {
    await page.goto('/statistics?day=2023-10-12')
    await page
        .getByRole('button', { name: /previous/i })
        .first()
        .click()
    await expect(page).toHaveURL(/day=2023-10-11/)
})

test('a day with data shows text when data is present', async ({ page }) => {
    await page.goto('/statistics?day=2022-01-01')
    await expect(page.getByText(/total consumption/i)).toBeVisible()
    await expect(page.getByText(/total production/i)).toBeVisible()
    await expect(page.getByText(/average price/i)).toBeVisible()
})
