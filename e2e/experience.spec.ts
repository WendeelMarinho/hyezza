import { expect, test, type Page } from '@playwright/test'

function trackErrors(page: Page) {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
  return errors
}

test.describe('ONE — experiência', () => {
  test('abre o hero com os nomes, sem erros e fora dos buscadores', async ({ page }) => {
    const errors = trackErrors(page)
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toContainText('Hyezza')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Wendeel')
    await expect(page).toHaveTitle('ONE — Hyezza & Wendeel')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBe(0)
    expect(errors).toEqual([])
  })

  test('entrar na história leva até os 365 dias', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Entrar na nossa história' }).click()
    await expect(page.getByText('Dias juntos')).toBeInViewport({ timeout: 5_000 })
  })

  test('uma estrela abre a cápsula de memória e Esc fecha', async ({ page }) => {
    await page.goto('/')
    await page.locator('#memorias').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Nosso primeiro café' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('heading', { name: 'Nosso primeiro café' })).toBeVisible()

    await dialog.getByRole('button', { name: 'Próxima' }).click()
    await expect(dialog.getByRole('heading', { name: 'A cidade acesa' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('o modo história percorre as memórias', async ({ page }) => {
    await page.goto('/')
    await page.locator('#memorias').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Modo história' }).click()
    await expect(page.getByText('01 / 13')).toBeVisible()
    await page.getByRole('button', { name: 'Próxima' }).click()
    await expect(page.getByText('02 / 13')).toBeVisible()
    await page.getByRole('button', { name: 'Encerrar história' }).click()
    await expect(page.getByText('02 / 13')).toBeHidden()
  })

  test('continuar a história abre a carta e revela 365 / ∞', async ({ page }) => {
    await page.goto('/')
    await page.locator('#year-two').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Continuar nossa história' }).click()

    const letter = page.getByRole('dialog', { name: 'Carta' })
    await expect(letter).toBeVisible()
    await expect(letter.getByText('Hyezza,')).toBeVisible()

    // Toque na carta revela tudo de uma vez.
    await letter.getByText('Feliz 1 ano para nós.').click({ force: true })
    await expect(letter.getByText('365 / ∞')).toBeVisible({ timeout: 5_000 })

    await letter.getByRole('button', { name: 'Voltar ao universo' }).click()
    await expect(letter).toBeHidden()
    await expect(page.locator('#year-two').getByText('365 / ∞')).toBeVisible()
  })

  test('o menu leva a cada seção', async ({ page, isMobile }) => {
    await page.goto('/')
    if (isMobile) await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.getByRole('navigation', { name: 'Seções' }).getByRole('button', { name: 'Nosso Futuro' }).click()
    await expect(page.locator('#futuro')).toBeInViewport({ timeout: 5_000 })
  })
})
