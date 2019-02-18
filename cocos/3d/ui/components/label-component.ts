/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos.com

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in this License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

import Font from '../../../assets/CCFont';
import { SpriteFrame } from '../../../assets/CCSpriteFrame';
import { ImageAsset } from '../../../assets/image-asset';
import { ccclass, executionOrder, menu, property } from '../../../core/data/class-decorator';
import macro from '../../../core/platform/CCMacro';
import { ccenum } from '../../../core/value-types/enum';
import { UIRenderComponent } from './ui-render-component';
import { ISharedLabelData } from '../assembler/label/ttfUtils';
import { UI } from '../../../renderer/ui/ui';

/**
 * !#en Enum for text alignment.
 * !#zh 文本横向对齐类型
 * @enum Label.HorizontalAlign
 */
/**
 * !#en Alignment left for text.
 * !#zh 文本内容左对齐。
 * @property {Number} LEFT
 */
/**
 * !#en Alignment center for text.
 * !#zh 文本内容居中对齐。
 * @property {Number} CENTER
 */
/**
 * !#en Alignment right for text.
 * !#zh 文本内容右边对齐。
 * @property {Number} RIGHT
 */
const HorizontalAlign = macro.TextAlignment;

/**
 * !#en Enum for vertical text alignment.
 * !#zh 文本垂直对齐类型
 * @enum Label.VerticalAlign
 */
/**
 * !#en Vertical alignment top for text.
 * !#zh 文本顶部对齐。
 * @property {Number} TOP
 */
/**
 * !#en Vertical alignment center for text.
 * !#zh 文本居中对齐。
 * @property {Number} CENTER
 */
/**
 * !#en Vertical alignment bottom for text.
 * !#zh 文本底部对齐。
 * @property {Number} BOTTOM
 */
const VerticalAlign = macro.VerticalTextAlignment;

/**
 * !#en Enum for Overflow.
 * !#zh Overflow 类型
 * @enum Label.Overflow
 */
/**
 * !#en NONE.
 * !#zh 不做任何限制。
 * @property {Number} NONE
 */
/**
 * !#en In CLAMP mode, when label content goes out of the bounding box, it will be clipped.
 * !#zh CLAMP 模式中，当文本内容超出边界框时，多余的会被截断。
 * @property {Number} CLAMP
 */
/**
 * !#en In SHRINK mode, the font size will change dynamically to adapt the content size.
 * !#zh SHRINK 模式，字体大小会动态变化，以适应内容大小。
 * @property {Number} SHRINK
 */
/**
 * !#en In RESIZE_HEIGHT mode, you can only change the width of label and the height is changed automatically.
 * !#zh 在 RESIZE_HEIGHT 模式下，只能更改文本的宽度，高度是自动改变的。
 * @property {Number} RESIZE_HEIGHT
 */
enum Overflow {
    NONE = 0,
    CLAMP = 1,
    SHRINK = 2,
    RESIZE_HEIGHT = 3,
}

ccenum(Overflow);

/**
 * !#en Enum for font type.
 * !#zh Type 类型
 * @enum Label.Type
 */
/**
 * !#en The TTF font type.
 * !#zh TTF字体
 * @property {Number} TTF
 */
/**
 * !#en The bitmap font type.
 * !#zh 位图字体
 * @property {Number} BMFont
 */
/**
 * !#en The system font type.
 * !#zh 系统字体
 * @property {Number} SystemFont
 */

/**
 * !#en The Label Component.
 * !#zh 文字标签组件
 * @class Label
 * @extends UIRenderComponent
 */
@ccclass('cc.LabelComponent')
@executionOrder(100)
@menu('UI/Label')
export class LabelComponent extends UIRenderComponent {
    /**
     * !#en Content string of label.
     * !#zh 标签显示的文本内容。
     * @property {String} string
     */
    @property
    get string () {
        return this._string;
    }
    set string (value) {
        value = value.toString();
        if (this._string === value) {
            return;
        }

        this._string = value;
        this.updateRenderData();
        this._checkStringEmpty();
    }

    /**
     * !#en Horizontal Alignment of label.
     * !#zh 文本内容的水平对齐方式。
     * @property {Label.HorizontalAlign} horizontalAlign
     */
    @property({
        type: HorizontalAlign,
    })
    get horizontalAlign () {
        return this._horizontalAlign;
    }

    set horizontalAlign (value) {
        if (this._horizontalAlign === value) {
            return;
        }

        this._horizontalAlign = value;
        this.updateRenderData();
    }

    /**
     * !#en Vertical Alignment of label.
     * !#zh 文本内容的垂直对齐方式。
     * @property {Label.VerticalAlign} verticalAlign
     */
    @property({
        type: VerticalAlign,
    })
    get verticalAlign () {
        return this._verticalAlign;
    }

    set verticalAlign (value) {
        if (this._verticalAlign === value) {
            return;
        }

        this._verticalAlign = value;
        this.updateRenderData();
    }

    /**
     * !#en The actual rendering font size in shrink mode
     * !#zh SHRINK 模式下面文本实际渲染的字体大小
     * @property {Number} actualFontSize
     */
    @property
    get actualFontSize () {
        return this._actualFontSize;
    }

    /**
     * !#en Font size of label.
     * !#zh 文本字体大小。
     * @property {Number} fontSize
     */
    @property
    get fontSize () {
        return this._fontSize;
    }

    set fontSize (value) {
        if (this._fontSize === value) {
            return;
        }

        this._fontSize = value;
        this.updateRenderData();
    }

    /**
     * !#en Font family of label, only take effect when useSystemFont property is true.
     * !#zh 文本字体名称, 只在 useSystemFont 属性为 true 的时候生效。
     * @property {String} fontFamily
     */
    @property
    get fontFamily () {
        return this._fontFamily;
    }

    set fontFamily (value) {
        if (this._fontFamily === value) {
            return;
        }

        this._fontFamily = value;
        this.updateRenderData();
    }

    /**
     * !#en Line Height of label.
     * !#zh 文本行高。
     * @property {Number} lineHeight
     */
    @property
    get lineHeight () {
        return this._lineHeight;
    }
    set lineHeight (value) {
        if (this._lineHeight === value) {
            return;
        }

        this._lineHeight = value;
        this.updateRenderData();
    }

    /**
     * !#en Overflow of label.
     * !#zh 文字显示超出范围时的处理方式。
     * @property {Overflow} overflow
     */
    @property({
        type: Overflow,
    })
    get overflow () {
        return this._overflow;
    }

    set overflow (value: Overflow) {
        if (this._overflow === value) {
            return;
        }

        this._overflow = value;
        this.updateRenderData();
    }

    /**
     * !#en Whether auto wrap label when string width is large than label width.
     * !#zh 是否自动换行。
     * @property {Boolean} enableWrapText
     */
    @property
    get enableWrapText () {
        return this._enableWrapText;
    }
    set enableWrapText (value) {
        if (this._enableWrapText === value) {
            return;
        }

        this._enableWrapText = value;
        this.updateRenderData();
    }

    /**
     * !#en The font of label.
     * !#zh 文本字体。
     * @property {Font} font
     */
    @property({
        type: Font,
    })
    get font () {
        // return this._N$file;
        return this._font;
    }

    set font (value: Font | null) {
        if (this._font === value) { return; }

        // if delete the font, we should change isSystemFontUsed to true
        this._isSystemFontUsed = !value;

        if (CC_EDITOR && value) {
            this._userDefinedFont = value;
        }

        // this._N$file = value;
        this._font = value;
        this._bmFontOriginalSize = -1;
        // if (value && this._isSystemFontUsed)
        //     this._isSystemFontUsed = false;

        if (typeof value === 'string') {
            cc.warnID(4000);
        }

        if (value instanceof cc.BitmapFont) {
            this._bmFontOriginalSize = value.fontSize;
        }

        if (this._renderData) {
            this.destroyRenderData();
            this._renderData = null;
        }
        // this._fontAtlas = null;
        this._updateAssembler();
        this._applyFontTexture(true);
        this.updateRenderData();
    }

    /**
     * !#en Whether use system font name or not.
     * !#zh 是否使用系统字体。
     * @property {Boolean} isSystemFontUsed
     */
    @property
    get useSystemFont () {
        return this._isSystemFontUsed;
    }

    set useSystemFont (value) {
        if (this._isSystemFontUsed === value) {
            return;
        }

        this.destroyRenderData();
        this._renderData = null;

        if (CC_EDITOR) {
            if (!value && this._isSystemFontUsed && this._userDefinedFont) {
                this.font = this._userDefinedFont;
                this.spacingX = this._spacingX;
                return;
            }
        }

        this._isSystemFontUsed = !!value;
        if (value) {
            this.font = null;
            this._updateAssembler();
            this.updateRenderData();
            this._checkStringEmpty();
        }
        // else if (!this._userDefinedFont) {
        //     this.disableRender();
        // }

    }

    @property
    get spacingX () {
        return this._spacingX;
    }

    set spacingX (value) {
        if (this._spacingX === value) {
            return;
        }

        this._spacingX = value;
        this.updateRenderData();
    }

    /**
     * !#en Whether the font is bold or not.
     * !#zh 字体是否加粗。
     * @property {Boolean} isBold
     */
    @property
    get isBold () {
        return this._isBold;
    }

    set isBold (value) {
        if (this._isBold === value) {
            return;
        }

        this._isBold = value;
    }

    /**
     * !#en Whether the font is tilted or not.
     * !#zh 字体是否倾斜。
     * @property {Boolean} isBold
     */
    @property
    get isItalic () {
        return this._isItalic;
    }

    set isItalic (value) {
        if (this._isItalic === value) {
            return;
        }

        this._isItalic = value;
    }

    /**
     * !#en Whether the font is underlined.
     * !#zh 字体是否加下划线。
     * @property {Boolean} isBold
     */
    @property
    get isUnderline () {
        return this._isUnderline;
    }

    set isUnderline (value) {
        if (this._isUnderline === value) {
            return;
        }

        this._isUnderline = value;
    }

    get texture (){
        return this._texture;
    }

    get assemblerData(){
        return this._assemblerData;
    }

    public static HorizontalAlign = HorizontalAlign;
    public static VerticalAlign = VerticalAlign;
    public static Overflow = Overflow;
    @property
    public _useOriginalSize = true;
    @property
    public _string = 'label';
    @property
    public _horizontalAlign = HorizontalAlign.LEFT;
    @property
    public _verticalAlign = VerticalAlign.TOP;
    @property
    public _actualFontSize = 0;
    @property
    public _fontSize = 40;
    @property
    public _fontFamily = 'Arial';
    @property
    public _lineHeight = 40;
    @property
    public _overflow: Overflow = Overflow.NONE;
    @property
    public _enableWrapText = true;
    // // 这个保存了旧项目的 file 数据
    // _N$file = null;
    @property
    public _font: Font | null = null;
    @property
    public _isSystemFontUsed = true;
    @property
    public _bmFontOriginalSize = -1;
    @property
    public _spacingX = 0;
    @property
    public _isItalic = false;
    @property
    public _isBold = false;
    @property
    public _isUnderline = false;

    // don't need serialize
    private _texture: SpriteFrame | null = null;
    private _ttfTexture: SpriteFrame | null = null;
    private _userDefinedFont: Font | null = null;
    private _assemblerData: ISharedLabelData|null = null;

    constructor () {
        super();
        if (CC_EDITOR) {
            this._userDefinedFont = null;
        }

        this._ttfTexture = null;
    }

    public onEnable () {
        // this._super();
        super.onEnable();

        // TODO: Hack for barbarians
        if (!this._font && !this._isSystemFontUsed) {
            this.useSystemFont = true;
        }
        // Reapply default font family if necessary
        if (this._isSystemFontUsed && !this._fontFamily) {
            this.fontFamily = 'Arial';
        }

        this._checkStringEmpty();
        this.updateRenderData(true);
        // this._updateAssembler();
        // this._activateMaterial();
    }

    public onDisable () {
        super.onDisable();
        // this._super();
    }

    public onDestroy () {
        if (this._assembler && this._assembler.resetAssemblerData) {
            this._assembler.resetAssemblerData(this._assemblerData!);
        }

        this._assemblerData = null;
        if (this._ttfTexture) {
            this._ttfTexture.destroy();
            this._ttfTexture = null;
        }
        // this._super();
    }

    public updateAssembler(render: UI) {
        if (!this._material) {
            return;
        }
        super.updateAssembler(render);
    }

    public updateRenderData(force = false) {
        const renderData = this._renderData;
        if (renderData) {
            renderData.vertDirty = true;
            renderData.uvDirty = true;
            // this.markForUpdateRenderData(true);
        }

        if (force) {
            this._updateAssembler();
            this._applyFontTexture(force);
        }
    }

    // private _canRender () {
    //     // let result = this._super();
    //     let result = this._enabled;
    //     const font = this.font;
    //     if (font instanceof cc.BitmapFont) {
    //         const spriteFrame = font.spriteFrame;
    //         // cannot be activated if texture not loaded yet
    //         if (!spriteFrame || !spriteFrame.textureLoaded()) {
    //             result = false;
    //         }
    //     }
    //     return result;
    // }

    private _checkStringEmpty () {
        // this.markForRender(!!this.string);
    }

    private _updateAssembler () {
        const assembler = LabelComponent.Assembler!.getAssembler(this);

        if (this._assembler !== assembler) {
            this.destroyRenderData();
            this._assembler = assembler;
        }

        if (!this._renderData) {
            if (this._assembler && this._assembler.createData){
                this._renderData = this._assembler.createData(this);
                this._renderData.material = this._material;
            }
        }
    }

    protected _updateColor () {
        const font = this.font;
        if (font instanceof cc.BitmapFont) {
            // this._super();
        } else {
            this.updateRenderData(false);
            // this.node._renderFlag &= ~RenderFlow.FLAG_COLOR;
        }
    }

    private _activateMaterial (force) {
        const material = this._material;
        // if (material && !force) {
        //     return;
        // }

        // if (!material) {
        //     // material = new SpriteMaterial();
        //     this._material = cc.builtinResMgr.get('sprite-material');
        //     material = this._material;
        // }
        // Setup blend function for premultiplied ttf label texture
        if (this._texture === this._ttfTexture) {
            this._srcBlendFactor = cc.macro.BlendFactor.ONE;
        } else {
            this._srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
        }

        if (material) {
            material.setProperty('mainTexture', this._texture);
        }
        // For batch rendering, do not use uniform color.
        // material!.useColor = false;
        // this._updateMaterial(material);
    }

    private _applyFontTexture (force) {
        const font = this._font;
        if (font instanceof cc.BitmapFont) {
            const spriteFrame = font.spriteFrame;
            const self = this;
            const onBMFontTextureLoaded = () => {
                // TODO: old texture in material have been released by loader
                self._texture = spriteFrame;
                self._activateMaterial(force);

                if (force && self._assembler && self._assembler.updateRenderData) {
                    self._assembler.updateRenderData(self);
                }
            };
            // cannot be activated if texture not loaded yet
            if (spriteFrame && spriteFrame.textureLoaded()) {
                onBMFontTextureLoaded();
            } else {
                // this.disableRender();

                if (spriteFrame) {
                    spriteFrame.once('load', onBMFontTextureLoaded, this);
                    spriteFrame.ensureLoadTexture();
                }
            }
        } else {
            if (!this._ttfTexture) {
                this._ttfTexture = new cc.SpriteFrame();
                // this._ttfTexture.setFilters(cc.Texture2D.Filter.LINEAR, cc.Texture2D.Filter.LINEAR);
                // this._ttfTexture.setWrapMode(cc.Texture2D.WrapMode.CLAMP_TO_EDGE, cc.Texture2D.WrapMode.CLAMP_TO_EDGE);
                // TTF texture in web will blend with canvas or body background color
                if (!CC_JSB) {
                    // this._ttfTexture.setPremultiplyAlpha(true);
                }

                if (this._assembler && this._assembler.getAssemblerData) {
                    this._assemblerData = this._assembler.getAssemblerData();
                }

                if (this._assemblerData) {
                    this._ttfTexture!.image = new ImageAsset(this._assemblerData.canvas);
                }
                // this._ttfTexture.initWithElement(this._assemblerData.canvas);
            }
            this._texture = this._ttfTexture;
            this._activateMaterial(force);

            if (force && this._assembler && this._assembler.updateRenderData) {
                this._assembler.updateRenderData(this);
            }
        }
    }
}

cc.LabelComponent = LabelComponent;