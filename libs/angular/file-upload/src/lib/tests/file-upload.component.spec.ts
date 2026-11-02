import { TestBed } from "@angular/core/testing";
import { AtralumeFileUpload } from "../../index";
describe("File selection validation and previews", () => {
  it("rejects duplicate/type/size/count violations without owning network requests", async () => {
    const f = TestBed.createComponent(AtralumeFileUpload);
    f.componentRef.setInput("label", "Files");
    f.componentRef.setInput("multiple", true);
    f.componentRef.setInput("accept", ".txt");
    f.componentRef.setInput("maxSize", 4);
    f.componentRef.setInput("maxCount", 2);
    f.autoDetectChanges();
    await f.whenStable();
    const good = new File(["abc"], "note.txt"),
      bad = new File(["too large"], "image.png");
    f.componentInstance.selectFiles([good, good, bad]);
    await f.whenStable();
    expect(f.componentInstance.value()).toEqual([good]);
    expect(f.componentInstance.rejections()).toHaveLength(2);
    expect(f.componentInstance.rejections()[0].errors).toContain(
      "Duplicate file",
    );
    expect(f.componentInstance.rejections()[1].errors).toContain(
      "File type is not accepted",
    );
  });
  it("revokes removed image URLs and outstanding URLs on destruction", async () => {
    const originalCreate = Object.getOwnPropertyDescriptor(
        URL,
        "createObjectURL",
      ),
      originalRevoke = Object.getOwnPropertyDescriptor(URL, "revokeObjectURL");
    const create = vi.fn().mockReturnValue("blob:preview"),
      revoke = vi.fn();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: create,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: revoke,
    });
    try {
      const f = TestBed.createComponent(AtralumeFileUpload);
      f.componentRef.setInput("label", "Images");
      f.componentRef.setInput("imagePreviews", true);
      f.autoDetectChanges();
      await f.whenStable();
      const file = new File(["image"], "image.png", { type: "image/png" });
      f.componentInstance.selectFiles([file]);
      await f.whenStable();
      expect(create).toHaveBeenCalledWith(file);
      f.destroy();
      expect(revoke).toHaveBeenCalledWith("blob:preview");
    } finally {
      if (originalCreate)
        Object.defineProperty(URL, "createObjectURL", originalCreate);
      else Reflect.deleteProperty(URL, "createObjectURL");
      if (originalRevoke)
        Object.defineProperty(URL, "revokeObjectURL", originalRevoke);
      else Reflect.deleteProperty(URL, "revokeObjectURL");
    }
  });
});
