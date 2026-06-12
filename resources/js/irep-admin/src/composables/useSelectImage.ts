import { ref } from "vue";
import { imageInterface } from "../../types/components";
import ajaxAxios from "@/src/utils/axios";

export function useSelectImage(multiple?: boolean) {
  const selectedImages = ref<imageInterface[]>([]);

  const selectImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,application/pdf";
    input.multiple = !!multiple;

    input.onchange = async () => {
      const files = Array.from(input.files ?? []);
      if (!files.length) return;

      const uploads: imageInterface[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("action", "irep_upload_image");
        formData.append("file", file);

        try {
          const res = await ajaxAxios.post("", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          if (res.data?.success && res.data?.data) {
            uploads.push(res.data.data as imageInterface);
          }
        } catch (e) {
          console.error("Image upload failed", e);
        }
      }

      if (!uploads.length) return;

      if (multiple) {
        selectedImages.value = [...selectedImages.value, ...uploads];
      } else {
        selectedImages.value = [uploads[0]];
      }
    };

    input.click();
  };

  return {
    selectedImages,
    selectImage
  };
}
