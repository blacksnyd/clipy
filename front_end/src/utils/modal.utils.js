export const makeOpenModalHandler = (setIsModalOpen) => () => {
  setIsModalOpen(true)
}

export const makeCloseModalHandler = (setIsModalOpen) => () => {
  setIsModalOpen(false)
}

export const makeVideoCreatedHandler = (setReloadTrigger) => () => {
  setReloadTrigger((prev) => prev + 1)
}
