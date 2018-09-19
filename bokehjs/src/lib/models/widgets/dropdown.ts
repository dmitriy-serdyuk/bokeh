import {AbstractButton, AbstractButtonView} from "./abstract_button"
import {CallbackLike} from "../callbacks/callback"

import {div, show, hide} from "core/dom"
import * as p from "core/properties"

export class DropdownView extends AbstractButtonView {
  model: Dropdown

  protected _open: boolean = false

  protected menu: HTMLElement

  render(): void {
    super.render()

    if (!this.is_split_button) {
      this.el.classList.add("bk-dropdown")
      this.buttonEl.classList.add("bk-dropdown-toggle")
      this.buttonEl.appendChild(div({class: "bk-caret"}))
    } else {
      this.el.classList.add("bk-btn-group")
      const caret = this._render_button(div({class: "bk-caret"}))
      caret.classList.add("bk-dropdown-toggle")
      caret.addEventListener("click", () => this._toggle_menu())
      this.el.appendChild(caret)
    }

    const items = this.model.menu.map((item, i) => {
      if (item == null)
        return div({class: "bk-divider"})
      else {
        const [label,] = item
        const el = div({}, label)
        el.addEventListener("click", () => this._item_click(i))
        return el
      }
    })

    this.menu = div({class: ["bk-menu", "bk-below"]}, items)
    this.el.appendChild(this.menu)
    hide(this.menu)
  }

  protected _show_menu(): void {
    if (!this._open) {
      this._open = true
      show(this.menu)

      const listener = (event: MouseEvent) => {
        const {target} = event
        if (target instanceof HTMLElement && !this.el.contains(target)) {
          document.removeEventListener("click", listener)
          this._hide_menu()
        }
      }
      document.addEventListener("click", listener)
    }
  }

  protected _hide_menu(): void {
    if (this._open) {
      this._open = false
      hide(this.menu)
    }
  }

  protected _toggle_menu(): void {
    if (this._open)
      this._hide_menu()
    else
      this._show_menu()
  }

  protected _button_click(): void {
    if (!this.is_split_button)
      this._toggle_menu()
    else {
      this._hide_menu()
    }
  }

  protected _item_click(_i: number): void {
    this._hide_menu()
  }

  get is_split_button(): boolean {
    return this.model.default_value != null
  }
}

export namespace Dropdown {
  export interface Attrs extends AbstractButton.Attrs {
    default_value: string | null
    menu: ([string, string | CallbackLike<Dropdown>] | null)[]
  }

  export interface Props extends AbstractButton.Props {
    default_value: p.Property<string | null>
    menu: p.Property<([string, string | CallbackLike<Dropdown>] | null)[]>
  }
}

export interface Dropdown extends Dropdown.Attrs {}

export class Dropdown extends AbstractButton {
  properties: Dropdown.Props

  constructor(attrs?: Partial<Dropdown.Attrs>) {
    super(attrs)
  }

  static initClass(): void {
    this.prototype.type = "Dropdown"
    this.prototype.default_view = DropdownView

    this.define({
      default_value: [ p.String    ],
      menu:          [ p.Array, [] ],
    })

    this.override({
      label: "Dropdown",
    })
  }
}
Dropdown.initClass()
