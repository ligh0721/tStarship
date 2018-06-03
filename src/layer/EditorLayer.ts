class EditorLayer extends tutils.Layer {
    protected onInit() {
        let panel = new EditorPanel();
        this.addChild(panel);
    }
}
